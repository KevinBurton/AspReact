import * as React from 'react';
import {findDOMNode} from 'react-dom';

declare var $;
declare var kendo;

export interface DatePickerProps {
    id: string;
    name: string;
    format?: string;
    isEnabled?: boolean;
    min?: Date;
    max?: Date;
    value?: Date;
    onSelect: (comboBoxValue: string) => void; 
}

const DatePicker = React.createClass<DatePickerProps, any>({
    render() {
        const { id, name, format, isEnabled, min, value  } = this.props;
        return (
            <input type="text" id={id} name={name}
                data-date-format={format} min ={min} value={value} /> 
        );
    },

    componentDidMount() {
        const domNode = findDOMNode(this);
        let isBoxEnabled = this.props.isEnabled;
        if (isBoxEnabled == undefined) {
            isBoxEnabled = true;
        }

        $(domNode).kendoDatePicker({
            month: {
                empty: '<span class="k-state-disabled">#= data.value #</span>',
                content: '# if ((new Date(data.date)).getDay()!=1) { #' +    
                '<div class="k-state-disabled disableNonMonday" >#= data.value #</div>' +
                '# } else { #' +
                '#= data.value #' +
                '# } #'
            },
            min:this.props.min,
            change: (e) => {
                this.props.onSelect(e.sender.value());
            },
            open: function () {
             
                $(".disableNonMonday").parent().removeClass("k-link");
                $(".disableNonMonday").parent().removeAttr("href");
            }
        });

        
        $("div").on("mouseover",".disableNonMonday", function () {
         
            if ($(".disableNonMonday").parent().hasClass("k-link")) {
                $(".disableNonMonday").parent().removeClass("k-link");
                $(".disableNonMonday").parent().css({
                    'display': 'block',
                    'overflow': 'hidden',
                    'min-height': ' 1.8333em',
                    'line-height': '1.8333em',
                    'padding': '0 .45em 0 .1em'
                });

                $(".disableNonMonday").parent().removeAttr("href");
            }
           
        });
        
    },


});

export default DatePicker;