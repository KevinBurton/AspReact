import * as React from 'react';
import {findDOMNode} from 'react-dom';

declare var $;
declare var kendo;

export interface ComboBoxProps {
	id: string;
	name: string;
	url: string;
	dataTextField: string;
	dataValueField: string;
    placeholder: string;
    selectedValue?: any;
    isEnabled?: boolean;
	onSelect: (comboBoxValue: number, comboBoxText: string) => void;
}

const ComboBox = React.createClass<ComboBoxProps, any>({
	render() {
		const { id, name, selectedValue, isEnabled } = this.props;
		return (
            <input id={id} name={name} defaultValue={selectedValue} />
		);
	},

	componentDidMount() {
        const domNode = findDOMNode(this);
        let isBoxEnabled = this.props.isEnabled;
        if (isBoxEnabled == undefined) {
            isBoxEnabled = true;
        }

            $(domNode).kendoComboBox({
                dataSource: {
                    transport: {
                        read: {
                            url: this.props.url,
                            data: this.getDataSourceData
                        },
                        prefix: ''
                    },
                    serverFiltering: true,
                    filter: [],
                    schema: {
                        errors: 'Errors'
                    }
                },
                dataTextField: this.props.dataTextField,
                dataValueField: this.props.dataValueField,
                delay: 400,
                filter: 'contains',
                minLength: 2,
                autoBind: false,
                highlightFirst: true,
                placeholder: this.props.placeholder || '',
                enabled: isBoxEnabled,
                change: (e) => {
                    this.props.onSelect(e.sender.value(), e.sender.text());
                }
            });       
	},

	getDataSourceData(data: any) {
		if (data.filter && data.filter.filters.length > 0) {
			return {
				text: data.filter.filters[0].value
			};
		} else {
			return {
				text: ''
			};
		}
	}
});

export default ComboBox;