import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';

import HelpButton from './HelpButton';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Label } from './Form';
const itemStatusDatesHelpText = "Status dates are based on the event currently selected for the session. When there is no event selected, all status dates will be blank. You will see the event-specific target dates for: promote to Peer Review, promote to Management Review, promote to Editing, and Complete date. Once a session is submitted for approval, the Status Dates section will show approvals and promotions of the session throughout the workflow process.";

export interface ItemStatusDatesProps {
    getComponentData: (component: Object) => void;
    componentDescriptor: ComponentDescriptor;
    ItemStatusDates: Object;
}

export const ItemStatusDatesComponent = React.createClass<ItemStatusDatesProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'ItemStatusDates',
            returnObjectType: 'itemStatusDates',
            stateFunction:
            '(objectAssign.default({}, state, { ItemStatusDates: action.newObject});)',
            dataDictionary: {
                ID: '',
                ItemId: '',
                ItemStatusId: '',
                ItemStatusDateTypeId : '',
                DateValue: '',
                EmployeeId:''
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');    
    },


    componentDidMount() {
          
    },

    upsertChange: function (itemStatusDate: any) {
     
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['ItemStatusId'] = itemStatusDate.ItemStatusId;
        this.componentDescriptor.dataDictionary['ItemStatusDateTypeId'] = itemStatusDate.ItemStatusDateTypeId;
        this.componentDescriptor.dataDictionary['DateValue'] = itemStatusDate.DateValue;
        this.componentDescriptor.dataDictionary['EmployeeId'] = itemStatusDate.EmployeeId;
        this.props.componentData(this.componentDescriptor, 'Upsert');
    },

    render() {
       
        const isdList = this.props.ItemStatusDates;
      

        return (
             
            <div className="portlet" id="status-dates">
                <div className="portlet-title">
                    <div className="caption">
                        Status Dates
                    </div>
                    <div className="actions">
                        <span  className="pull-right" >
                            <HelpButton  title="Item Status Dates"  text={itemStatusDatesHelpText}  /></span>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="slimScrollDiv">
                        <div className="scrolly">
                     
                        <table >
                            <tbody>
                                {isdList[0].ID.Value != '' ?
                                    isdList.sort((a, b) => {
                                        var id1 = a.ItemStatusId.Value;
                                        var id2 = b.ItemStatusId.Value;
                                        if (id1 < id2) {
                                            return -1;
                                        } else if (id1 > id2) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    })
                                        .map((isd: any) => (
                                        <tr className="block-content list nbfc"  key={isd.ID.Value}>

                                            <td  className="list-item-container">
                                                {isd.ItemStatusDescription.Value}
                                            </td>
                                            <td  className="list-item-container">
                                                    
                                                        <div>Planned Date</div>
                                                {(isd.ItemStatusDateTypeId.Value == '1') ?
                                                        <div> {isd.DateValue.Value}   <a href="#"> <span className="icon-edit"></span></a> </div>
                                                    :
                                                            <div className="text-muted">Pending...</div>
                                                } 
                                            </td>
                                            <td className="list-item-container">
                                                    <div>Actual Date</div>
                                                {(isd.ItemStatusDateTypeId.Value == '2') || (isd.ItemStatusDateTypeId.Value == '3') ?
                                                        <div> {isd.DateValue.Value} </div>
                                                    :
                                                        <div className="text-muted">Pending...</div>
                                                }
                                                
                                            </td>
                                            <td  className="list-item-container">
                                                    <div>Completed By</div>
                                                    <div id="ideaCompleted"> {isd.EmployeeName.Value} </div>
                                            </td>
                                            <td className="list-item-right">
                                                {(isd.ItemStatusId.Value == '0') ?
                                                    <a className = "btn btn-sm btn-success list-item-trigger">Submit</a>
                                                    :
                                                    <button type="submit" className="btn-link" >
                                                        Promote
                                                    </button>
                                                }

                                                {(isd.ItemStatusId.Value == '12') ?
                                                    <button type="submit" className="btn-link" >
                                                        Demote
                                                    </button> :
                                                    <div></div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                    )
                                    : <tr></tr>
                                }
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
             
           
		);
	}
});

const mapStateToProps = (state) => {
    if (!state.ItemStatusDates) {
        const { itemId } = state;
        return {
            itemId: itemId,
            ItemStatusDates: [
                {
                    ID: { Value: '' },
                    ItemId: {Value:  itemId },
                    ItemStatusId: { Value: '0' },
                    ItemStatusDescription: {Value:''},
                    ItemStatusDateTypeId: { Value: '0' },
                    ItemStatusDateTypeDescription: { Value: '' },
                    EmployeeId: { Value: '0' },
                    EmployeeName: {Value:''},
                    DateValue: { Value: '' }
                }]
        };
    }

    return {
        itemId: state.itemId,
        ItemStatusDates: state.ItemStatusDates
    };
};

export const ItemStatusDatesContainer =
    connect(
        mapStateToProps,
        actions
    )(ItemStatusDatesComponent as React.ClassicComponentClass<any>);

export default ItemStatusDatesComponent;