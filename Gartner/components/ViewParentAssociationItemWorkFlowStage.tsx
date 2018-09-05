import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { Input, FormGroup, TextArea, Label } from './Form';
import * as actions from '../actions/genericActions';
import * as ajax from '../utils/ajax';
import objectAssign from '../utils/objectAssign';
import isEqual from '../utils/isEqual';
import { ComponentDescriptor } from '../models/generic';
import { SetComponentDescriptorRefresh } from '../utils/eventEmitter';
import { ReadyForUseDateContainer } from './ReadyForUseDate';
import DatePicker from './kendo/DatePicker';


export interface ViewParentAssociationItemWorkFlowStageProps {
    componentDescriptor: ComponentDescriptor;
    ViewParentAssociationItemWorkFlowStage: Object;
    getLastCompletedStage: () => String;
}

export const ViewParentAssociationItemWorkFlowStageComponent = React.createClass<ViewParentAssociationItemWorkFlowStageProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'ViewParentAssociationItemWorkFlowStage',
            returnObjectIndexed: false,
            returnObjectType: 'ViewParentAssociationItemWorkFlowStage',
            stateFunction:
            '(objectAssign.default({}, state, { ViewParentAssociationItemWorkFlowStage: action.newObject});)',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                ItemStatusId: '',
                ItemStatusDateTypeId: '',
                DateValue: '',
                EmployeeId: ''
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;

        const self = this;
        this.props.eventEmitter.addListener('ViewParentAssociationItemWorkFlowStageRefresh', (itemId: number) => {
            var componentDescriptor = objectAssign({}, self.componentDescriptor, {
                dataDictionary: { ItemId: itemId }
            });
            self.props.componentData(componentDescriptor, 'GetData');
        });

        this.props.componentData(this.componentDescriptor, 'GetData');
     },
    componentWillUnmount() {
        this.props.eventEmitter.removeListener('ViewParentAssociationItemWorkFlowStageRefresh');
    },
    currentWorkFlowStage: {
        ID: '0',
        ItemId: '',
        ItemStatusId: '',
        ItemStatusDateTypeId: '',
        DateValue: '',
        EmployeeId: ''
    },
    saveReadyForUseDate(e) {
        if (e == null) {
            toastr.error("Enter Valid Date");
        }
        else {
            //This client side validation is required because sometime past date is considered as null and dont make its way to server
            let currentDate = new Date();
            
            if (e > currentDate) {
                let formattedDate = new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit'
                }).format(e);
                var customComponentDesriptor = {
                    name: 'ReadyForUseDate',
                    returnObjectIndexed: true,
                    stateFunction:
                    '(objectAssign.default({}, state, { ReadyForUseDate: action.newObject[0]});)',
                    dataDictionary: {
                        ID: '0', ItemId: '', ItemStatusId: '9', ItemStatusDateTypeId: '1', DateValue: '', EmployeeId: ''
                    }
                }

                customComponentDesriptor.dataDictionary["ID"] = this.currentWorkFlowStage.ID.Value;
                customComponentDesriptor.dataDictionary["ItemId"] = this.currentWorkFlowStage.ItemId.Value;
                customComponentDesriptor.dataDictionary["ItemStatusId"] = this.currentWorkFlowStage.ItemStatusId.Value;
                customComponentDesriptor.dataDictionary["ItemStatusDateTypeId"] = this.currentWorkFlowStage.ItemStatusDateTypeId.Value;;
                customComponentDesriptor.dataDictionary["DateValue"] = formattedDate;
                customComponentDesriptor.dataDictionary["EmployeeId"] = this.currentWorkFlowStage.EmployeeId.DefaultValue;

                this.props.componentData(customComponentDesriptor, 'UpdateReadyForUseDate');
            }
            else { toastr.error("Enter Future Date"); }
        }

    },
    render() {

        const workFlowStageList = this.props.ViewParentAssociationItemWorkFlowStage;
        if (workFlowStageList != null && workFlowStageList != undefined && workFlowStageList.length > 0) {
            for (var i = 0; i < workFlowStageList.length; i++) {
                if (workFlowStageList[i].DateValue.IsVisible == true && workFlowStageList[i].DateValue.IsEnabled == true) {
                    this.currentWorkFlowStage = workFlowStageList[i];
                    console.log("Enabled Workflow", this.currentWorkFlowStage);
                }
            }
        };
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        return (

            <div className="portlet-body">
                <div className="show-details">
                    <div className="list-unstyled list-inline">
                        {workFlowStageList[0].ID.Value != '0' ?
                            workFlowStageList.sort((a, b) => {
                                var id1 = parseInt(a.HLCSortOrder.Value);
                                var id2 = parseInt(b.HLCSortOrder.Value);

                                if (id1 < id2) {
                                    return -1;
                                } else if (id1 > id2) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            })
                                .map((workFlowStageList: any) => (
                                    <tr className="block-content list "  key={workFlowStageList.ID.Value}>
                                        <td  className="list-item-container">
                                            {(workFlowStageList.ItemStatusDesc.IsVisible == true) ?
                                                <div><strong>{ workFlowStageList.ItemStatusDesc.DefaultValue } </strong>

                                                </div>
                                                :
                                                <div></div>}
                                        </td>

                                        <td  className="list-item-container">
                                            {(workFlowStageList.DateValue.IsVisible == true) ?
                                                <div>{(workFlowStageList.DateValue.IsEnabled == true) ? <DatePicker id="readyForUseDate" name="readyForUseDate" min={futureDate}
                                                    onSelect= {(selectedDate) => this.saveReadyForUseDate(selectedDate) } value={workFlowStageList.DateValue.DefaultValue}
                                                    format={'dd-MMM-yyyy'}   ></DatePicker> : <div>{workFlowStageList.DateValue.DefaultValue}</div>}</div>
                                                :
                                                <div></div>}
                                        </td>

                                    </tr>
                                )
                                )
                            : <tr></tr>
                        }
                    </div>
                </div>
            </div>


        );
    }
});

const mapStateToProps = (state) => {
    if (!state.ViewParentAssociationItemWorkFlowStage) {
        const { itemId } = state;
        return {
            itemId: itemId,
            eventEmitter: state.eventEmitter,
            ViewParentAssociationItemWorkFlowStage: [
                {
                    ID: { Value: '0' },
                    ItemId: { Value: itemId },
                    ItemStatusId: { Value: '0' },
                    ItemStatusDesc: { Value: '', DefaultValue: '' },
                    ItemStatusDateTypeId: { Value: '0' },
                    ItemStatusDateTypeDescription: { Value: '' },
                    EmployeeId: { Value: '0' },
                    EmployeeName: { Value: '' },
                    HLCSortOrder: { Value: '' },
                    DateValue: { Value: '' }
                }]
        };
    }

    return {
        itemId: state.itemId,
        eventEmitter: state.eventEmitter,
        ViewParentAssociationItemWorkFlowStage: state.ViewParentAssociationItemWorkFlowStage,
   };
};

export const ViewParentAssociationItemWorkFlowStageContainer =
    connect(
        mapStateToProps,
        actions
    )(ViewParentAssociationItemWorkFlowStageComponent as React.ClassicComponentClass<any>);

export default ViewParentAssociationItemWorkFlowStageComponent;