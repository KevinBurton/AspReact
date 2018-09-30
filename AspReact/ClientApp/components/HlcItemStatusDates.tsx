import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import objectAssign from '../utils/objectAssign';
import { ApplicationState }  from '../store';
import * as HlcItemStatusDatesStore from '../store/HlcItemStatusDates';
import HelpButton from './HelpButton';
import PQFModal from './PQFModal';
import * as $ from "jquery";
import componentData from '../utils/componentData';
import eventEmitter from '../utils/eventEmitter';

type HlcItemStatusDatesProps = HlcItemStatusDatesStore.HlcItemStatusDatesState &
                               typeof HlcItemStatusDatesStore.actionCreators;

class HlcItemStatusDates extends React.Component<HlcItemStatusDatesProps, any> {
  HlcItemStatusDatesHelpText:string = "Status dates are based on the event currently selected for the session. When there is no event selected, all status dates will be blank. You will see the event-specific target dates for: promote to Peer Review, promote to Management Review, promote to Editing, and Complete date. Once a session is submitted for approval, the Status Dates section will show approvals and promotions of the session throughout the workflow process.";
	componentDescriptor: ComponentDescriptor = {
    name: 'HlcItemStatusDates',
    returnObjectIndexed: false,
    returnObjectType: 'hlcItemStatusDates',
    stateFunction:
    '(objectAssign.default({}, state, { HlcItemStatusDates: action.newObject});)',
    dataDictionary: {
      ID: '0',
      ItemId: '',
      ItemStatusId: '',
      ItemStatusDateTypeId: '',
      DateValue: '',
      EmployeeId: ''
    },
    onComponentOperationComplete: () => {}
  };
	plannedDateList: string[] =['Peer Review', 'Final Management Review', 'Presentation Templating', 'Graphic Review', 'Ready For Use'];
	modalSelector: string = '#PQFPopUp';
	constructor(props: any) {
		super(props);

    // Bindings
    this.upsertSubmitChange = this.upsertSubmitChange.bind(this);
    this.upsertPromoteWithModalChange = this.upsertPromoteWithModalChange.bind(this);
    this.upsertDemoteChange = this.upsertDemoteChange.bind(this);
    this.upsertPromoteChange = this.upsertPromoteChange.bind(this);
    this.upsertDateChange = this.upsertDateChange.bind(this);
    this.getFormattedDate = this.getFormattedDate.bind(this);
  }
  componentWillMount() {
    // https://stackoverflow.com/questions/49525389/element-implicitly-has-an-any-type-because-type-0-has-no-index-signature
		this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
    eventEmitter.addListener('ItemStatusDatesRefresh', (itemId: number) => {
        var componentDescriptor = objectAssign({}, this.componentDescriptor, {
            dataDictionary: { ItemId: itemId }
        });
        componentData(componentDescriptor, 'GetData');
    });
		componentData(this.componentDescriptor, 'GetData');
  }
  componentWillUnmount() {
    eventEmitter.removeListener('ItemStatusDatesRefresh');
  }
	upsertSubmitChange(hlcItemStatusDate: any) {

		let formattedDate = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(new Date());

		this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
		this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
		this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
		this.componentDescriptor.dataDictionary['EmployeeId'] = "UseModifiedByUserId";
		this.componentDescriptor.dataDictionary['ItemStatusDateTypeId'] = '3'; //Actual End Date
		this.componentDescriptor.dataDictionary['DateValue'] = formattedDate;
    this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

    this.componentDescriptor.onComponentOperationComplete = () => {
        eventEmitter.emitEvent('ViewParentAssociationItemWorkFlowStageRefresh', [this.props.itemId]);
        eventEmitter.emitEvent('ResearchAgendaRefresh', [this.props.itemId]);
    };
		componentData(this.componentDescriptor, 'Submit');
	}

	upsertPromoteChange(hlcItemStatusDate: any) {
		let formattedDate = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(new Date());

		this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
		this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
		this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
		this.componentDescriptor.dataDictionary['EmployeeId'] = "UseModifiedByUserId";
		this.componentDescriptor.dataDictionary['ItemStatusDateTypeId'] = '3'; //Actual End Date
		this.componentDescriptor.dataDictionary['DateValue'] = formattedDate;
    this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

    this.componentDescriptor.onComponentOperationComplete = () => {
            eventEmitter.emitEvent('ViewParentAssociationItemWorkFlowStageRefresh', [this.props.itemId]);
            eventEmitter.emitEvent('ResearchAgendaRefresh', [this.props.itemId]);
        };

		componentData(this.componentDescriptor, 'Promote');
	}
 	upsertPromoteWithModalChange(hlcItemStatusDate: any) {
		$(this.modalSelector).modal('show');
	}
	upsertDemoteChange(hlcItemStatusDate: any) {

		let formattedDate = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(new Date());

		this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
		this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
		this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
		this.componentDescriptor.dataDictionary['EmployeeId'] = "UseModifiedByUserId";
		this.componentDescriptor.dataDictionary['ItemStatusDateTypeId'] = '1';
		this.componentDescriptor.dataDictionary['DateValue'] = '';
    this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;

    this.componentDescriptor.onComponentOperationComplete = () => {
            eventEmitter.emitEvent('ViewParentAssociationItemWorkFlowStageRefresh', [this.props.itemId]);
            eventEmitter.emitEvent('ResearchAgendaRefresh', [this.props.itemId]);
    };

		componentData(this.componentDescriptor, 'Demote');
	}

	upsertDateChange(date: any, hlcItemStatusDate: any) {

			let formattedDate = new Intl.DateTimeFormat('en-GB', {
				year: 'numeric',
				month: 'long',
				day: '2-digit'
			}).format(date);

			this.componentDescriptor.dataDictionary['ID'] = hlcItemStatusDate.ID.Value;
			this.componentDescriptor.dataDictionary['ItemId'] = hlcItemStatusDate.ItemId.Value;
			this.componentDescriptor.dataDictionary['ItemStatusId'] = hlcItemStatusDate.ItemStatusId.Value;
			this.componentDescriptor.dataDictionary['EmployeeId'] = hlcItemStatusDate.EmployeeId.Value;
			this.componentDescriptor.dataDictionary['ItemStatusDateTypeId'] = hlcItemStatusDate.ItemStatusDateTypeId.Value;
			this.componentDescriptor.dataDictionary['DateValue'] = formattedDate;

			componentData(this.componentDescriptor, 'Upsert');
	}

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
	}
	public	render() {
		$(this.modalSelector).modal("hide");
		const hisdList = this.props.hlcItemStatusDates;

        return (

			<div className="portlet" >
				<div className="portlet-title">
					<div className="caption">
						Status Dates
					</div>
					<div className="actions">
						<span  className="pull-right" >
							<HelpButton  title="Item Status Dates"  text={this.HlcItemStatusDatesHelpText}  /></span>
					</div>
				</div>
				<div className="portlet-body" id="hlc-status-dates">
					<div className="slimScrollDiv">
						<div className="scrolly">

							<table>
								<tbody>
                                    {typeof (hisdList[0]) !== 'undefined' && typeof (hisdList[0].ID.Value) !== 'undefined' && hisdList[0].ID.Value != null && hisdList[0].ID.Value != '0' ?
										(hisdList as any[]).sort((a:any, b:any) => {
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
											.map((hisd: any) => (
												<tr key={hisd.ID.Value}>

													<td>
														{hisd.ItemStatusDescription.DefaultValue}
													</td>
													<td>
														<div>Planned Date</div>
														{ this.plannedDateList.indexOf(hisd.ItemStatusDescription.DefaultValue) >= 0 ?
															<div className="text-muted"> { this.getFormattedDate(hisd.PlannedDate.Value) } </div>
															:
															<div className="text-muted">N/A</div>
														}
													</td>
													<td>
														<div>Actual Date</div>
														{(hisd.EmployeeName.Value != '') && (hisd.ActualEndDate.Value != '') ?
															<div className="text-muted"> {this.getFormattedDate(hisd.ActualEndDate.Value) } </div>
															:
															<div className="text-muted">Pending...</div>
														}

													</td>

													<td>
														<div>Completed By</div>
														{(hisd.EmployeeName.Value != '')  ?
															<div className="text-muted" id="ideaCompleted"> {hisd.EmployeeName.Value} </div>
															:
															(hisd.IsSuccess.Value == 'Y') && (hisd.DeclineButton.IsVisible == true)?
																<div className="text-muted">Declined...</div>
																: <div className="text-muted">Pending...</div>
														}
													</td>
													<td>
														{(hisd.SubmitButton.IsVisible == true) ?
															<button type="submit" className="btn-link btn-action" autoFocus  onClick={() => this.upsertSubmitChange(hisd) }  >
																Submit
															</button>
															: <td></td>}

														{(hisd.ApproveButton.IsVisible == true) ?
															<button type= "submit" className= "btn-link" autoFocus onClick={() => this.upsertPromoteChange(hisd) }  >
																<span className="icon-check"></span>
															</button>
                                                            : <td></td>}

														{(hisd.DeclineButton.IsVisible == true) ?
															<button type= "submit" className= "btn-link" onClick={() => this.upsertDemoteChange(hisd) }  >
																<span className="icon-declined"></span>
															</button>
                                                            : <td></td>}

														{(hisd.PromoteButton.IsVisible == true) ?
															<button type="submit" className="btn-link btn-action" autoFocus onClick={() => this.upsertPromoteChange(hisd) }  >
																{hisd.PromoteButton.DefaultValue}
																</button>
                                                            : <td></td>}
														{(hisd.PromoteWithModalButton.IsVisible == true) ?
															<div>
																<PQFModal promote={() => this.upsertPromoteChange(hisd)} />
																<button type="submit" className="btn-link btn-action" autoFocus  onClick={() => this.upsertPromoteWithModalChange(hisd) }  >
																Promote
															</button>
															</div>
                                                            : <td></td>}

														{(hisd.DemoteButton.IsVisible == true ) ?
															<button type="submit" className="btn-link btn-action btn-demote" onClick={() => this.upsertDemoteChange(hisd) }  >
															   Demote
															</button>
                                                            : <td></td>}
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
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => { // Selects which state properties are merged into the component's props
                                   return { hlcItemStatusDates: state.hlcItemStatusDates };
                                  },
    HlcItemStatusDatesStore.actionCreators                      // Selects which action creators are merged into the component's props
)(HlcItemStatusDates) as typeof HlcItemStatusDates;
