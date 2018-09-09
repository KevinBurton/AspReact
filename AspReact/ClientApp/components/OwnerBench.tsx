import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/generic';

import HelpButton from './HelpButton';
import { Input, FormGroup, TextArea, Label } from './Form';
import EmployeePicker from './EmployeePicker';


export interface OwnerBenchProps {
	OwnerBench: Object;
}

export const OwnerBenchComponent = React.createClass<OwnerBenchProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'OwnerBench',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { OwnerBench: action.newObject});)',
            dataDictionary: {
                ID: '0', ItemId: '', EmployeeId: '', ItemAuthorTypeId: ''
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');
    },


    upsertChange: function (employee: any) {
        if (employee != '') {
            this.componentDescriptor.dataDictionary['ID'] = '0';
            this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
            this.componentDescriptor.dataDictionary["EmployeeId"] = employee.id;
            this.componentDescriptor.dataDictionary["ItemAuthorTypeId"] = '2';
            this.props.componentData(this.componentDescriptor, 'Upsert');
            this.props.eventEmitter.emitEvent('QVRReviewerRefresh', [this.props.itemId]);
            this.props.eventEmitter.emitEvent('ItemStatusDatesRefresh', [this.props.itemId]);
        }
    },

    makePrimary: function (Owner: any) {
        if (Owner != "") {
            this.componentDescriptor.dataDictionary['ID'] = Owner.ID.Value;
            this.componentDescriptor.dataDictionary['EmployeeId'] = Owner.EmployeeId.Value;
            this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
            this.componentDescriptor.dataDictionary['ItemAuthorTypeId'] = "MakePrimary";
            this.props.componentData(this.componentDescriptor, 'Upsert');
        }

    },

    deleteSelected(Owner: any) {

        this.componentDescriptor.dataDictionary['ID'] = Owner.ID.Value;
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['EmployeeId'] = Owner.EmployeeId.Value;

        this.props.componentData(this.componentDescriptor, 'Delete');

        this.props.eventEmitter.emitEvent('QVRReviewerRefresh', [this.props.itemId]);
        this.props.eventEmitter.emitEvent('ItemStatusDatesRefresh', [this.props.itemId]);

    },
    render() {
        const OwnerBench = this.props.OwnerBench;

        return (
            <div id="OwnerBench">
                    <div className="form-group">
                    <Label id="Reviewer_Label" text="OWNER(S)  " required={this.props.OwnerBench[0].ID.IsRequired} />
                        <div>
                                <EmployeePicker id={"addOwnerEmployeePicker"}
                                    buttonText="Add"
                                    onSelect={(employee) => this.upsertChange(employee) }
                                    isEnabled={this.props.OwnerBench[0].EmployeeId.IsEnabled}/>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-condensed">
                                    <tbody>
                                        {OwnerBench[0].ID.Value != '0' ?
                                            OwnerBench.sort((a, b) => {
                                                var nameA = a.FullName.Value.toUpperCase();
                                                var nameB = b.FullName.Value.toUpperCase();
                                                if (nameA < nameB) {
                                                    return -1;
                                                } else if (nameA > nameB) {
                                                    return 1;
                                                } else {
                                                    return 0;
                                                }
                                            })
                                                .filter((Owner: any) => { return Owner.ItemAuthorTypeId.Value == '1'; })
                                                .map((Owner: any) => (
                                                    <tr  key={Owner.ID.Value}>
                                                        <td  className="text-middle" width="50%" >
                                                            {Owner.FullName.Value} ({Owner.ItemAuthorTypeId.DefaultValue})
                                                        </td>
                                                    </tr>
                                                )
                                                )
                                            : <tr></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>


                            <div className="table-responsive">
                                <table className="table table-condensed">
                                    <tbody>

                                        {OwnerBench[0].ID.Value != '0' ?

                                            OwnerBench.sort((a: any, b: any) => {
                                                var nameA = a.FullName.Value.toUpperCase();
                                                var nameB = b.FullName.Value.toUpperCase();
                                                if (nameA < nameB) {
                                                    return -1;
                                                } else if (nameA > nameB) {
                                                    return 1;
                                                } else {
                                                    return 0;
                                                }
                                            })
                                                .filter((Owner: any) => { return Owner.ItemAuthorTypeId.Value != '1'; })
                                                .map((Owner: any) => (
                                                    <tr  key={Owner.ID.Value}>
                                                        <td  className="text-middle"  width="50%">
                                                            {Owner.FullName.Value} ({Owner.ItemAuthorTypeId.DefaultValue})
                                                        </td>
                                                        {Owner.ActionButton.DefaultValue == 'Make Primary' ?
                                                            <td width="50%">
                                                                <button type="button"
                                                                    className="btn btn-xs btn-custom btn-secondary btn-hlc"
                                                                    onClick={() => this.makePrimary(Owner) }
                                                                    disabled={!Owner.ActionButton.IsEnabled}>Make Primary
                                                                </button>
                                                                <button type="button"
                                                                    className="btn btn-xs btn-custom delete-button"
                                                                    onClick={() => this.deleteSelected(Owner) }
                                                                    disabled={!Owner.ActionButton.IsEnabled}>
                                                                    <span className="icon-trash">
                                                                    </span></button>
                                                            </td>
                                                            :
                                                            <td></td>}
                                                    </tr>
                                                )
                                                )
                                            : <tr></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
            </div>);
    }
});

const mapStateToProps = (state: any) => {
	if (!state.OwnerBench) {
		const { itemId } = state;
		return {
			itemId: state.itemId,
			eventEmitter: state.eventEmitter,
			OwnerBench: [{
				ID: { Value: '' }
				, EmployeeId: { Value: '' }
				, FullName: { Value: '' }
				, ItemAuthorTypeId: { Value: '' }
				, ActionButton: { Value: '' }
			}]
		};
	}

	return {
		itemId: state.itemId,
		eventEmitter: state.eventEmitter,
		OwnerBench: state.OwnerBench
	};
};

export default OwnerBenchComponent;

