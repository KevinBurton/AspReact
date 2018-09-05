import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import HelpButton from './HelpButton';
const readyForUseDateHelpText = "Ready for Use Date guidance is no earlier than 12 weeks in the future and at least one week prior to the first event where this will be presented.";  
const ConfirmationText = "Ready for Use date selected will create a short production window which may have impacts on resource availability to support content Production. Please confirm to continue";
import { Label }  from './Form';
import DatePicker from './kendo/DatePicker';
import ConfirmationModal from './ConfirmationModal';

export interface ReadyForUseDateProps {

    getComponentData: (component: Object) => void;
    ReadyForUseDate: Object;
    componentDescriptor: ComponentDescriptor;
    getInitialState: Function;
    updateState: Function;
    itemid: string;
}

export const ReadyForUseDateComponent = React.createClass<ReadyForUseDateProps, any>({

    componentWillMount() {

        this.componentDescriptor = {
            name: 'ReadyForUseDate',
            returnObjectIndexed: true,
            stateFunction:
            '(objectAssign.default({}, state, { ReadyForUseDate: action.newObject[0]});)',
            dataDictionary: {
                ID: '0', ItemId: '', ItemStatusId: '9', ItemStatusDateTypeId: '1', DateValue: '', EmployeeId: ''
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

        this.props.componentData(this.componentDescriptor, 'GetData');
    },

    componentDidMount() {
    },

    saveReadyForUseDate(e) {
        //This client side validation is required because sometime past date is considered as null and dont make its way to server
        if(e==null)
        {
        toastr.error("Enter Valid Date");
        }
        else
        {
        let currentDate = new Date();
        let warningDate = new Date(this.props.ReadyForUseDate.DateValue.MaxValue); 
        if (e > currentDate) {
           if (e < warningDate) {
               var result = $("#showModal").trigger("click");
           }
           let formattedDate = new Intl.DateTimeFormat('en-GB', {
               year: 'numeric',
               month: 'long',
               day: '2-digit'
           }).format(e);

           this.componentDescriptor.dataDictionary["ID"] = this.props.ReadyForUseDate.ID.Value;
           this.componentDescriptor.dataDictionary["ItemStatusId"] = '9';
           this.componentDescriptor.dataDictionary["ItemStatusDateTypeId"] = '1';
           this.componentDescriptor.dataDictionary["DateValue"] = formattedDate;
           this.componentDescriptor.dataDictionary["EmployeeId"] = this.props.ReadyForUseDate.EmployeeId.DefaultValue;

           this.props.componentData(this.componentDescriptor, 'Upsert');
       }
        else
           {
        toastr.error("Enter Future Date");
           }
        }
    },
    render() {
        
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        return (
            <div id="readyForUseDate">
                <div>
                    <div className="form-group" >
                        <Label id="ReadyForUseDate_Label" text="READY FOR USE DATE  " required={this.props.ReadyForUseDate.ID.IsRequired} />
                        <span  className="pull-right" >
                            <HelpButton  title="ReadyForUseDate"  text={readyForUseDateHelpText}  />
                        </span>

                        <div>
                            <DatePicker id="readyForUseDate" name="readyForUseDate" min={futureDate}  
                                onSelect= {(selectedDate) => this.saveReadyForUseDate(selectedDate) } 
                                format={'dd-MMM-yyyy'}   ></DatePicker>
                            <ConfirmationModal CancelButtonText="OK" ConfirmationHeader="Confirm Date Selection..."
                                ConfirmationText={ConfirmationText}  />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ReadyForUseDate) {
        const { itemId } = state;
        return {
            itemId: state.itemId,
            ReadyForUseDate: {
                ID: {
                    Value: '',
                    IsRequired: true
                },
                ItemId: {
                    Value: itemId
                },
                ItemStatusId: {
                    Value: '9'
                },
                ItemStatusDateTypeId: {
                    Value: '1'
                },
                DateValue:
                {
                    Value:'',       
                    IsRequired: true
                },
                EmployeeId: {
                    Value: ''
                }
            }
        };
    }

    return {
        itemId: state.itemId,
        ReadyForUseDate: state.ReadyForUseDate
    };
};

export const ReadyForUseDateContainer =
    connect(
        mapStateToProps,
        actions
    )(ReadyForUseDateComponent) as React.ClassicComponentClass<any>;


export default ReadyForUseDateComponent;


