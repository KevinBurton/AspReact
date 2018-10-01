import * as React from 'react';
import { connect } from 'react-redux';
import HelpButton from './HelpButton';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
const HlcItemStatusDatesHelpText = "Status dates are based on the event currently selected for the session. When there is no event selected, all status dates will be blank. You will see the event-specific target dates for: promote to Peer Review, promote to Management Review, promote to Editing, and Complete date. Once a session is submitted for approval, the Status Dates section will show approvals and promotions of the session throughout the workflow process.";
import PQFModal from './PQFModal';

export interface HlcItemStatusDatesProps {
	componentData: (component: Object) => void;
	componentDescriptor: ComponentDescriptor;
	HlcItemStatusDates: [any];
	getFormattedDate?: (date: String) => String;
}

export const HlcItemStatusDatesComponent = React.createClass<HlcItemStatusDatesProps, any>({

    shouldComponentUpdate(nextProps: any): boolean {
        let result: boolean =
            !(typeof (nextProps.HlcItemStatusDates) === 'undefined' ||
              nextProps.HlcItemStatusDates.some((item) => typeof(item) === 'undefined') ||
              nextProps.HlcItemStatusDates.some((item) => typeof(item.ID) === 'undefined') ||
              nextProps.HlcItemStatusDates.some((item) => typeof(item.IsSuccess) === 'undefined') ||
              nextProps.HlcItemStatusDates[0].ID.Value == null ||
              nextProps.HlcItemStatusDates[0].ID.Value == '0');
        return result;
    },
	componentWillMount() {
		this.componentDescriptor = {
			name: 'HlcItemStatusDates',
			returnObjectIndexed: false,
			returnObjectType: 'hlcItemStatusDates',
			stateFunction:
			'(objectAssign.default({}, state, { HlcItemStatusDates: action.newObject});)',
			dataDictionary: {
				ID: '0',
				ItemId: '',
				ItemStatusId: '',
				DateValue: '',
				EmployeeId: ''
			}
		}
		this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
		this.props.componentData(this.componentDescriptor, 'GetData');
	
	},

	upsertSubmitChange: function (hlcItemStatusDate: any) {

		let formattedDate = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(new Date());

		this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
		this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
		this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
		this.componentDescriptor.dataDictionary['EmployeeId'] = "UseModifiedByUserId";
		this.componentDescriptor.dataDictionary['ActualEndDate'] = formattedDate;
        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

        this.props.componentData(this.componentDescriptor, 'Submit');

        this.props.eventEmitter.emitEvent('ItemStatusDisplayRefresh', [this.props.itemId]);
	},

	upsertPromoteChange: function (hlcItemStatusDate: any) {

		let formattedDate = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(new Date());

		this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
		this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
		this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
		this.componentDescriptor.dataDictionary['EmployeeId'] = "UseModifiedByUserId";
		this.componentDescriptor.dataDictionary['ActualEndDate'] = formattedDate;
		this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

		this.props.componentData(this.componentDescriptor, 'Promote');
		this.props.eventEmitter.emitEvent('ResearchAgendaRefresh', [this.props.itemId]);
		this.props.eventEmitter.emitEvent('ItemStatusDisplayRefresh', [this.props.itemId]);
		this.props.eventEmitter.emitEvent('ReviewerRefresh', [this.props.itemId]);
		this.props.eventEmitter.emitEvent('DiscussionRefresh', [this.props.itemId]);
	},
  
	upsertPromoteWithModalChange: function(hlcItemStatusDate: any) {
		$(this.modalSelector).modal('show');
	},

	componentWillUnmount() {

	},

	upsertDemoteChange: function (hlcItemStatusDate: any) {

		let formattedDate = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(new Date());

		this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
		this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
		this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
		this.componentDescriptor.dataDictionary['EmployeeId'] = "UseModifiedByUserId";
		this.componentDescriptor.dataDictionary['PlannedDate'] = '';
		
		this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'Demote');

        this.props.eventEmitter.emitEvent('ResearchAgendaRefresh', [this.props.itemId]);

        this.props.eventEmitter.emitEvent('ItemStatusDisplayRefresh', [this.props.itemId]);
	},

	upsertDateChange: function (date: any, hlcItemStatusDate: any) {

		let formattedDate = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(date);

		this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
		this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
		this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
		this.componentDescriptor.dataDictionary['EmployeeId'] = hlcItemStatusDate.EmployeeId.Value;
		this.componentDescriptor.dataDictionary['DateValue'] = formattedDate;

		this.props.componentData(this.componentDescriptor, 'Upsert');

	},

	getFormattedDate(date: string) {
		if (date != '') {
			let dt = new Date(date);

			let formattedDate = new Intl.DateTimeFormat('en-GB',
			{
				year: 'numeric',
				month: 'long',
				day: '2-digit'
			}).format(dt);

			return formattedDate.toString();
		}
		return '';
	},

	plannedDateList: ['Peer Review', 'Final Management Review', 'Presentation Templating', 'Graphic Review', 'Ready For Use'],


	modalSelector: '#PQFPopUp',
	render() {

// Note: This depends on the proper functioning of shouldComponentUpdate specified above
//       The function shouldComponentUpdate does not affect the initial state
		$(this.modalSelector).modal("hide");
		const hisdList = this.props.HlcItemStatusDates;
        return (

			<div className="portlet" >
				<div className="portlet-title">
					<div className="caption">
						Status Dates
					</div>
					<div className="actions">
						<span  className="pull-right" >
							<HelpButton  title="Item Status Dates"  text={HlcItemStatusDatesHelpText}  /></span>
					</div>
				</div>
				<div className="portlet-body" id="hlc-status-dates">
                    <div className="slimScrollDiv">
                        {hisdList.every((item) => item.ID.Value !== '0') ?
                            <div className="scrolly">
                                <table>
                                    <tbody>
                                        {
                                            hisdList.sort((a, b) => {
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
                                                .map((hisd: any) => {
                                                    return (
                                                        <tr key={hisd.ID.Value}>

                                                            <td>
                                                                {hisd.ItemStatusDescription.DefaultValue}
                                                            </td>
                                                            <td>
                                                                <div>Planned Date</div>
                                                                {this.plannedDateList.indexOf(hisd.ItemStatusDescription.DefaultValue) >= 0 ?
                                                                    <div className="text-muted"> {this.getFormattedDate(hisd.PlannedDate.Value)} </div>
                                                                    :
                                                                    <div className="text-muted">N/A</div>
                                                                }
                                                            </td>
                                                            <td>
                                                                <div>Actual Date</div>
                                                                {(hisd.EmployeeName.Value != '') && (hisd.ActualEndDate.Value != '') ?
                                                                    <div className="text-muted"> {this.getFormattedDate(hisd.ActualEndDate.Value)} </div>
                                                                    :
                                                                    <div className="text-muted">Pending...</div>
                                                                }
                                                            </td>

                                                            <td>
                                                                <div>Completed By</div>
                                                                {(hisd.EmployeeName.Value != '') ?
                                                                    <div className="text-muted" id="ideaCompleted"> {hisd.EmployeeName.Value} </div>
                                                                    :
                                                                    (hisd.IsSuccess.Value == 'Y') && (hisd.DeclineButton.IsVisible == true) ?
                                                                        <div className="text-muted">Declined...</div>
                                                                        : <div className="text-muted">Pending...</div>
                                                                }
                                                            </td>
                                                            <td>
                                                                {(hisd.SubmitButton.IsVisible == true) ?
                                                                    <button type="submit" className="btn-link btn-action" autoFocus onClick={() => this.upsertSubmitChange(hisd)}  >
                                                                        Submit
															</button>
                                                                    : <td></td>}

                                                                {(hisd.ApproveButton.IsVisible == true) ?
                                                                    <button type="submit" className="btn-link" autoFocus onClick={() => this.upsertPromoteChange(hisd)}  >
                                                                        <span className="icon-check"></span>
                                                                    </button>
                                                                    : <td></td>}

                                                                {(hisd.DeclineButton.IsVisible == true) ?
                                                                    <button type="submit" className="btn-link" onClick={() => this.upsertDemoteChange(hisd)}  >
                                                                        <span className="icon-declined"></span>
                                                                    </button>
                                                                    : <td></td>}

                                                                {(hisd.PromoteButton.IsVisible == true) ?
                                                                    <button type="submit" className="btn-link btn-action" autoFocus onClick={() => this.upsertPromoteChange(hisd)}  >
                                                                        {hisd.PromoteButton.DefaultValue}
                                                                    </button>
                                                                    : <td></td>}
                                                                {(hisd.PromoteWithModalButton.IsVisible == true) ?
                                                                    <div>
                                                                        <PQFModal promote={() => this.upsertPromoteChange(hisd)} />
                                                                        <button type="submit" className="btn-link btn-action" autoFocus onClick={() => this.upsertPromoteWithModalChange(hisd)}  >
                                                                            Promote
															</button>
                                                                    </div>
                                                                    : <td></td>}

                                                                {(hisd.DemoteButton.IsVisible == true) ?
                                                                    <button type="submit" className="btn-link btn-action btn-demote" onClick={() => this.upsertDemoteChange(hisd)}  >
                                                                        Demote
															</button>
                                                                    : <td></td>}
                                                            </td>
                                                        </tr>

                                                    );
                                                })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div>Loading . . .</div>
                            }
					</div>
				</div>
			</div>
				

		);
	}
});

const mapStateToProps = (state) => {
	if (!state.HlcItemStatusDates) {
		const { itemId } = state;
		return {
			itemId: itemId,
			eventEmitter: state.eventEmitter,
			HlcItemStatusDates: [
				{
					ID: { Value: '0' },
					ItemId: { Value: itemId },
					ItemStatusId: { Value: '0' },
					ItemStatusDescription: { Value: '', DefaultValue: '' },
					ItemStatusDateTypeDescription: { Value: '' },
					EmployeeId: { Value: '0' },
					EmployeeName: { Value: '' },
					SubmitButton: { IsVisible: false, Value: '' },
                    ApproveButton: { IsVisible: false, Value: '' },
                    DeclineButton: { IsVisible: false, Value: '' },
					HLCSortOrder: { Value: '0' },
                    PromoteButton: {
                        IsVisible: false, 
						Value: '',
						DefaultValue: ''
					},
                    PromoteWithModalButton: {
                        IsVisible: false,
                        Value: '',
                        DefaultValue: ''
                    },
                    DemoteButton: {
                        IsVisible: false, 
						Value: ''
					},
                    DateValue: { Value: '' },
                    IsSuccess: { Value: 'N'}
				}]
		};
	}

	return {
		itemId: state.itemId,
		eventEmitter: state.eventEmitter,
		HlcItemStatusDates: state.HlcItemStatusDates
	};
};

export const HlcItemStatusDatesContainer =
	connect(
		mapStateToProps,
		actions
	)(HlcItemStatusDatesComponent as React.ClassicComponentClass<any>);

export default HlcItemStatusDatesComponent;