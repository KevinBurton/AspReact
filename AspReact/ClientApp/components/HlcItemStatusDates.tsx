import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/generic';
import objectAssign from '../utils/objectAssign';
import { ApplicationState }  from '../store';
import { HlcItemStatusDatesState, actionCreators } from '../store/HlcItemStatusDates';

type HlcItemStatusDatesProps = HlcItemStatusDatesState;

class HlcItemStatusDates extends React.Component<HlcItemStatusDatesProps, any> {
  static defaultProps = {
    itemId: 0
  }
  componentData(componentDescriptor: ComponentDescriptor, operation: string) {

  }
	componentDescriptor: ComponentDescriptor;
	plannedDateList: string[];
	modalSelector: string;
	constructor(props: any) {
		super(props);
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
				ItemStatusDateTypeId: '',
				DateValue: '',
				EmployeeId: ''
			},
			onComponentOperationComplete: () => {}
    };

		this.plannedDateList =['Peer Review', 'Final Management Review', 'Presentation Templating', 'Graphic Review', 'Ready For Use']
    this.modalSelector = '#showPQFModal';

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
    const self = this;
    this.props.eventEmitter.addListener('ItemStatusDatesRefresh', (itemId: number) => {
        var componentDescriptor = objectAssign({}, self.componentDescriptor, {
            dataDictionary: { ItemId: itemId }
        });
        self.props.componentData(componentDescriptor, 'GetData');
    });
		this.props.componentData(this.componentDescriptor, 'GetData');
  }
  componentWillUnmount() {
    this.props.eventEmitter.removeListener('ItemStatusDatesRefresh');
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

    var self = this;
    this.componentDescriptor.onComponentOperationComplete = () => {
        self.props.eventEmitter.emitEvent('ViewParentAssociationItemWorkFlowStageRefresh', [self.props.itemId]);
        self.props.eventEmitter.emitEvent('ResearchAgendaRefresh', [self.props.itemId]);
    };
		this.props.componentData(this.componentDescriptor, 'Submit');
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

    var self = this;
    this.componentDescriptor.onComponentOperationComplete = () => {
            self.props.eventEmitter.emitEvent('ViewParentAssociationItemWorkFlowStageRefresh', [self.props.itemId]);
            self.props.eventEmitter.emitEvent('ResearchAgendaRefresh', [self.props.itemId]);
        };

		this.props.componentData(this.componentDescriptor, 'Promote');
	}
 	upsertPromoteWithModalChange(hlcItemStatusDate: any) {
		var result = $("#showPQFModal").trigger("click");
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

    var self = this;
    this.componentDescriptor.onComponentOperationComplete = () => {
            self.props.eventEmitter.emitEvent('ViewParentAssociationItemWorkFlowStageRefresh', [self.props.itemId]);
            self.props.eventEmitter.emitEvent('ResearchAgendaRefresh', [self.props.itemId]);
    };

		this.props.componentData(this.componentDescriptor, 'Demote');
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

			this.props.componentData(this.componentDescriptor, 'Upsert');
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
							<div className="scrolly">

								<table>
									<tbody>
										{(typeof (hisdList[0]) !== 'undefined' && (typeof (hisdList[0].ID.Value) !== 'undefined' || hisdList[0].ID.Value != null)) && hisdList[0].ID.Value != '0'   ?
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
												.map((hisd: any) => (
													<tr key={hisd.ID.Value}>

														<td>
															{hisd.ItemStatusDescription.DefaultValue}
														</td>
														<td>

															<div>Planned Date</div>
															{ this.plannedDateList.indexOf(hisd.ItemStatusDescription.DefaultValue) >= 0 ?
																<div className="text-muted"> { this.getFormattedDate(hisd.DateValue.Value) } </div>
																:
																<div className="text-muted">N/A</div>
															}
														</td>
														<td>
															<div>Actual Date</div>
															{(hisd.EmployeeName.Value != '') && (hisd.ItemStatusDateTypeId.Value == '2') || (hisd.ItemStatusDateTypeId.Value == '3') ?
																<div className="text-muted"> {this.getFormattedDate(hisd.DateValue.Value) } </div>
																:
																<div className="text-muted">Pending...</div>
															}

														</td>

														<td>
															<div>Completed By</div>
															{((hisd.EmployeeName.Value != '') && (hisd.ItemStatusDateTypeId.Value == '3')) ?
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
																: <div></div>}

															{(hisd.ApproveButton.IsVisible == true) ?
																<button type= "submit" className= "btn-link" autoFocus onClick={() => this.upsertPromoteChange(hisd) }  >
																	<span className="icon-check"></span>
																</button>
																: <div></div>}

															{(hisd.DeclineButton.IsVisible == true) ?
																<button type= "submit" className= "btn-link" onClick={() => this.upsertDemoteChange(hisd) }  >
																	<span className="icon-declined"></span>
																</button>
																: <div></div>}

															{(hisd.PromoteButton.IsVisible == true) ?
																<button type="submit" className="btn-link btn-action" autoFocus onClick={() => this.upsertPromoteChange(hisd) }  >
																	{hisd.PromoteButton.DefaultValue}
																	</button>
																: <div></div>}
															{(hisd.PromoteWithModalButton.IsVisible == true) ?
																<div>
																	<PQFModal hlcItemStatusDate={hisd} hlcItemStatusDateProps={this.props}
																		hlcItemStatusDateComponentDescriptor={this.componentDescriptor} reviewApproved={false} />
																	<button type="submit" className="btn-link btn-action" autoFocus  onClick={() => this.upsertPromoteWithModalChange(hisd) }  >
																	Promote
																</button>
																</div>
																: <div></div>}

															{(hisd.DemoteButton.IsVisible == true ) ?
																<button type="submit" className="btn-link btn-action btn-demote" onClick={() => this.upsertDemoteChange(hisd) }  >
																Demote
																</button>
																: <div></div>}
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
    (state: ApplicationState) => state.hlcItemStatusDates, // Selects which state properties are merged into the component's props
    HlcItemStatusDatesStore.actionCreators                 // Selects which action creators are merged into the component's props
)(HlcItemStatusDates) as typeof HlcItemStatusDates;
