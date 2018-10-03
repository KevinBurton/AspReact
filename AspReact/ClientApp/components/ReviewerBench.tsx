import * as React from 'react';
import { connect } from 'react-redux';
import { Label } from './Form';
import EmployeePicker from './EmployeePicker';
import objectAssign from '../utils/objectAssign';
import { ApplicationState }  from '../store';
import * as ReviewerBenchStore from '../store/ReviewerBench';
import BackupReviewersModal from './BackupReviewersModal';
import { ComponentDescriptor } from '../models/componentDescriptor';
import eventEmitter from '../utils/eventEmitter';
import * as $ from "jquery";
// Import to get rid of modal error
//https://stackoverflow.com/questions/32735396/error-ts2339-property-modal-does-not-exist-on-type-jquery
import * as bootstrap from "bootstrap"

type ReviewerBenchProps = ReviewerBenchStore.ReviewerBenchState & typeof ReviewerBenchStore.actionCreators;

class ReviewerBench extends React.Component<ReviewerBenchProps, any> {
    componentDescriptor: ComponentDescriptor;
    constructor(props: ReviewerBenchProps) {
        super(props);
        this.componentDescriptor = {
            name: 'ReviewerBench',
            returnObjectIndexed: false,
            returnObjectType: '',
            stateFunction: '',
            dataDictionary: {
                ID: '0',
                ItemId: '',
                Reason: '',
                ReviewedByEmployeeId: '',
                ReviewStatus: '',
                ReviewTimeUTC: '',
                EmployeeId: '',
                Description: '',
                ItemReviewerTypeId: ''
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
    }
    getInitialState() {
        return {
            Reviewer: {
                DelegateNames: { Value: '' },
                DelegateEmails: { Value: '' }
            }
        };
    }
    componentWillMount() {
        this.props.componentData(this.componentDescriptor, 'GetData');

        eventEmitter.addListener('ReviewerRefresh', (itemId: number) => {
            var componentDescriptor = objectAssign({}, this.componentDescriptor, {
                dataDictionary: { ItemId: itemId }
            });
            this.props.componentData(componentDescriptor, 'GetData');
        });

    }
    componentWillUnmount() {
        eventEmitter.removeListener('ReviewerRefresh');
    }
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
			eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);
		}
    }

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
            eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);
		}
    }

    deleteSelected(employee: any) {
		if (employee != '') {

			this.componentDescriptor.dataDictionary["ID"] = employee.ID.Value;
			this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
			this.componentDescriptor.dataDictionary["EmployeeId"] = employee.EmployeeId.Value;

			this.props.componentData(this.componentDescriptor, 'Delete');
			eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);
		}
    }
    getNames(DelegateNames: string): string[] {
        return DelegateNames.split(';');
    }

    getEmails(DelegateEmails: string): string[] {
        return DelegateEmails.split(';');
    }
    getDelegates(Reviewer: any): any[] {
        let names = this.getNames(Reviewer.DelegateNames.Value);
        let emails = this.getEmails(Reviewer.DelegateEmails.Value);
        let delString = [{
            Email: '',
            Name: ''
        }]

        for (var i = 0; i < names.length; i++) {
            delString.push({ Email: emails[i], Name: names[i] });
        }

        return delString;

    }

    reviewerBackupClick(Reviewer: any) {
        this.setState({ Reviewer: Reviewer });
        $('#reviewerBackupPopup').modal('show');
    }
    
    sort (a: any, b: any) {
		if (a < b) {
			return -1;
		}
		if (a > b) {
			return 1;
		}
		return 0;
	}

	reviewersSort(a: any, b: any) {
		var reviewStatusSort = this.sort(a.ReviewStatus.Value, b.ReviewStatus.Value);
		return reviewStatusSort !== 0
			? reviewStatusSort
			: this.sort(a.FullName.Value.toUpperCase(), b.FullName.Value.toUpperCase());
	}

    render() {
        const mandatoryReviewerType = '2';
        const peerReviewerType = '1';

        const itemReviewerTypeIds = [mandatoryReviewerType, peerReviewerType];

        const getReviewers = (itemReviewerTypeId: any) => {
            return this.props.reviewerBench && this.props.reviewerBench[0].ID.Value != '0' ?
                this.props.reviewerBench
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
                    <Label id="Reviewer_Label" text="REVIEWER(S)  " required={this.props.reviewerBench[0].ID.IsRequired} />
                    <div>
                        <EmployeePicker id={"addReviewerEmployeePicker"}
                            buttonText="Add"
                            onSelect={(employee) => this.upsertChange(employee)}
                            isEnabled={this.props.reviewerBench[0].EmployeeId.IsEnabled} />
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
}

const mapStateToProps = (state:any) => {
    if (!state.reviewerBench) {
        return {
            itemId: state.itemId,
            reviewerBench: [{
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
        itemId: state.itemId,
        reviewerBench: state.reviewerBench
    };
};

export default connect(
  (state: ApplicationState) => state.reviewerBench, // Selects which state properties are merged into the component's props
  ReviewerBenchStore.actionCreators                 // Selects which action creators are merged into the component's props
)(ReviewerBench) as typeof ReviewerBench;


