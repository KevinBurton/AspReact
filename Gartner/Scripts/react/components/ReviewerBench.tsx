import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Label } from './Form';
import EmployeePicker from './EmployeePicker';
import BackupReviewersModal from './BackupReviewersModal';

export interface ReviewerBenchProps {
	getComponentData: (component: Object) => void;
	ReviewerBench: Object;
	componentDescriptor: ComponentDescriptor;
}

export const ReviewerBenchComponent = React.createClass<ReviewerBenchProps, any>({
    getInitialState() {
        return {
            Reviewer: {
                DelegateNames: { Value: '' },
                DelegateEmails: { Value: '' }
            }
        };
    },

	componentWillMount() {
		this.componentDescriptor = {
			name: 'ReviewerBench',
			returnObjectIndexed: false,
			dataDictionary: {
				ID: '0', ItemId: '', Reason: '', ReviewedByEmployeeId: '', ReviewStatus: '', ReviewTimeUTC: '', EmployeeId: '', Description: '', ItemReviewerTypeId: ''
			}
		}

		this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
		this.props.componentData(this.componentDescriptor, 'GetData');
	},

	upsertChange(employee: any) {
		if (employee != '') {

			this.componentDescriptor.dataDictionary["ID"] = 0;
			this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
			this.componentDescriptor.dataDictionary["Reason"] = 'AddedByUser';
			this.componentDescriptor.dataDictionary["ReviewedByEmployeeId"] = '';
			this.componentDescriptor.dataDictionary["ReviewStatus"] = 'N';
			this.componentDescriptor.dataDictionary["EmployeeId"] = employee.id;
			this.componentDescriptor.dataDictionary["ItemReviewerTypeId"] = '1';

			this.props.componentData(this.componentDescriptor, 'Upsert');
			this.props.eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);
		}
	},

	toggleReviewComplete(Reviewer: any) {
		if (Reviewer != '') {

			this.componentDescriptor.dataDictionary["ID"] = Reviewer.ID.Value;
			this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
			this.componentDescriptor.dataDictionary["Reason"] = 'AddedByUser';
			this.componentDescriptor.dataDictionary["ReviewedByEmployeeId"] = 'UseModifiedByUserId';
			this.componentDescriptor.dataDictionary["ReviewStatus"] = Reviewer.ReviewStatus.Value == 'Y' ? 'N' : 'Y';
			this.componentDescriptor.dataDictionary["ReviewTimeUTC"] = Date.now();
			this.componentDescriptor.dataDictionary["EmployeeId"] = Reviewer.EmployeeId.Value;
			this.componentDescriptor.dataDictionary["ItemReviewerTypeId"] = Reviewer.ItemReviewerTypeId.Value;

			this.props.componentData(this.componentDescriptor, 'Upsert');
			this.props.eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);
		}
	},

	deleteSelected(employee: any) {
		if (employee != '') {

			this.componentDescriptor.dataDictionary["ID"] = employee.ID.Value;
			this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
			this.componentDescriptor.dataDictionary["EmployeeId"] = employee.EmployeeId.Value;

			this.props.componentData(this.componentDescriptor, 'Delete');
			this.props.eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);
		}
    },
    
    reviewerBackupClick(Reviewer: any) {
        this.setState({ Reviewer: Reviewer });
        $('#reviewerBackupPopup').modal('show');
    },

	sort: function (a: any, b: any) {
		if (a < b) {
			return -1;
		}
		if (a > b) {
			return 1;
		}
		return 0;
	},

	reviewersSort: function (a: any, b: any) {
		var reviewStatusSort = this.sort(a.ReviewStatus.Value, b.ReviewStatus.Value);
		return reviewStatusSort !== 0
			? reviewStatusSort
			: this.sort(a.FullName.Value.toUpperCase(), b.FullName.Value.toUpperCase());
	},

	render() {
		const mandatoryReviewerType = '2';
		const peerReviewerType = '1';

		const itemReviewerTypeIds = [mandatoryReviewerType, peerReviewerType];

		const getReviewers = (itemReviewerTypeId: any) => {
			return this.props.ReviewerBench && this.props.ReviewerBench[0].ID.Value != '0' ?
				this.props.ReviewerBench
					.filter((Reviewer) => Reviewer.ItemReviewerTypeId.Value === itemReviewerTypeId)
					.sort(this.reviewersSort)
				: [];
        };

		const ToggleButton = (props: any) => <button type="button"
			className="btn btn-xs btn-custom btn-secondary btn-hlc"
			onClick={() => this.toggleReviewComplete(props.Reviewer)}
			disabled={!props.Reviewer.ActionButton.IsEnabled}>
			{props.Reviewer.ReviewStatus.Value === 'Y' ? 'Completed' : 'Click to Complete'}
		</button>;

		const DeleteButton = (props: any) => <span>
			{props.Reviewer.ItemReviewerTypeId.Value === peerReviewerType &&
			<button type="button"
				className="btn btn-xs btn-custom delete-button"
				onClick={() => this.deleteSelected(props.Reviewer)}
				disabled={false}>
				<span className="icon-trash"></span>
			</button>}
        </span>;

        const blockDisplay = {
            display: 'block'
        };
        
        const Backups = (props: any) => <span>
            { props.Reviewer.ItemReviewerTypeId.Value === mandatoryReviewerType && 
                <span>
                { props.Reviewer.DelegateNames.Value != '' ?
                    <a href="#" style={blockDisplay} data-toggle="modal" data-target="#reviewerBackupPopup"
                        onClick={() => this.reviewerBackupClick(props.Reviewer)}>Backup(s)</a>
                    : <div className="text-muted">No backup(s) assigned.</div>
                }
                </span>
            }
            </span>

		return (
			<div id="ReviewerBench">
                <BackupReviewersModal Reviewer={this.state.Reviewer} ItemId={this.props.itemId}/>
				<div className="form-group">
					<Label id="Reviewer_Label" text="REVIEWER(S)  " required={this.props.ReviewerBench[0].ID.IsRequired} />
					<div>
						<EmployeePicker id={"addReviewerEmployeePicker"}
							buttonText="Add"
							onSelect={(employee) => this.upsertChange(employee)}
							isEnabled={this.props.ReviewerBench[0].EmployeeId.IsEnabled} />
					</div>
					{itemReviewerTypeIds.map((itemReviewerTypeId: string) => (
						<div key={itemReviewerTypeId} className="table-responsive">
						<table className="table table-condensed">
							<tbody>
								{getReviewers(itemReviewerTypeId).map((Reviewer: any) => (
									<tr key={Reviewer.ID.Value}>
										<td className="text-middle" width="50%">
											{Reviewer.FullName.Value} ({Reviewer.Description.Value})
                                            <Backups Reviewer={Reviewer} />
										</td>
										<td className="text-middle" width="25%">
											<ToggleButton Reviewer={Reviewer} />
											<DeleteButton Reviewer={Reviewer} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					))}
				</div>
			</div>
		);
	}
});

const mapStateToProps = (state) => {
	if (!state.ReviewerBench) {
		return {
			eventEmitter: state.eventEmitter,
			itemId: state.itemId,
			ReviewerBench: [{
				ID: { Value: '' }
				, ReviewedByEmployeeId: { Value: '' }
				, ReviewStatus: { Value: '' }
				, EmployeeId: { Value: '' }
				, FullName: { Value: '' }
				, VendorName: { Value: '' }
				, DelegateNames: { Value: '' }
				, DelegateEmails: { Value: '' }
				, Description: { Value: '' }
				, ItemReviewerTypeId: { Value: '' }
				, ActionButton: { Value: '' }
			}]
		};
	}

	return {
		eventEmitter: state.eventEmitter,
		itemId: state.itemId,
		ReviewerBench: state.ReviewerBench
	};
};

export const ReviewerBenchContainer =
	connect(
		mapStateToProps,
		actions
	)(ReviewerBenchComponent) as React.ClassicComponentClass<any>;


export default ReviewerBenchComponent;

