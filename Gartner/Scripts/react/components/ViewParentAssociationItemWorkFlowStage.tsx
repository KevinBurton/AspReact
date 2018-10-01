import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import DatePicker from './kendo/DatePicker';

export interface ViewParentAssociationItemWorkFlowStageProps {
	componentDescriptor: ComponentDescriptor;
	ViewParentAssociationItemWorkFlowStage: Object;
	HlcItemStatusDates: Object;
	getLastCompletedStage: () => String;
}

export const ViewParentAssociationItemWorkFlowStageComponent = React.createClass<ViewParentAssociationItemWorkFlowStageProps, any>({

	getInitialState() {
		return {
			currentWorkFlowStage: null
		}
	},

	componentWillMount() {
		this.componentDescriptor = {
			name: 'ViewParentAssociationItemWorkFlowStage',
			returnObjectIndexed: false,
			returnObjectType: 'ViewParentAssociationItemWorkFlowStage',
			stateFunction:
				'(objectAssign.default({}, state, { ViewParentAssociationItemWorkFlowStage: action.newObject});)',
			dataDictionary: {
				ID: '0',
				ItemId: this.props.itemId,
				ItemStatusId: '9',
				ItemStatusDateTypeId: '1',
				DateValue: '',
				EmployeeId: ''
			}
		}

		this.props.componentData(this.componentDescriptor, 'GetData');
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
				this.props.eventEmitter.emitEvent("ItemStatusDatesRefresh", [this.props.itemId]);

			}
			else { toastr.error("Enter Future Date"); }
		}

	},
	render() {

		this.currentWorkFlowStage = this.props.ViewParentAssociationItemWorkFlowStage[0];

		let futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 1);
		return (

			<div className="portlet-body">
				<div> Ready For Use: </div>
				<div className="block-content list" key={this.currentWorkFlowStage.ID.Value}>
					<div className="list-item-container">
						{this.currentWorkFlowStage && this.currentWorkFlowStage.DateValue.IsVisible == true &&
							<div>
								{this.currentWorkFlowStage.DateValue.IsEnabled == true
									? <DatePicker
										id="readyForUseDate"
										name="readyForUseDate"
										min={futureDate}
										onSelect={(selectedDate) => this.saveReadyForUseDate(selectedDate)}
										value={this.currentWorkFlowStage.DateValue.DefaultValue}
										format={'dd-MMM-yyyy'} />
									: <div>{this.currentWorkFlowStage.DateValue.DefaultValue}</div>}
							</div>}
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
		ViewParentAssociationItemWorkFlowStage: state.ViewParentAssociationItemWorkFlowStage
	};
};

export const ViewParentAssociationItemWorkFlowStageContainer =
	connect(
		mapStateToProps,
		actions
	)(ViewParentAssociationItemWorkFlowStageComponent as React.ClassicComponentClass<any>);

export default ViewParentAssociationItemWorkFlowStageComponent;