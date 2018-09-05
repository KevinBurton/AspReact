import * as React from 'react';
import { Reviewer, Qvr } from '../../models/qvr';
import objectAssign from '../../utils/objectAssign';
import EmployeePicker from '../EmployeePicker';
import Rating from './Rating';
import TriggerRatingModalButton from './TriggerRatingModalButton';
import RatingModalContainer from '../../containers/QvrRatingModalContainer';
import Avatar from '../Avatar';


export interface ReviewerListProps {
	showQvr: boolean;
	getQvr: Function;
	reviewers: Array<Reviewer>;
	saveQvr: (reviewerId: number, qvr: Qvr) => void;
	openRatingModal: (reviewer: Reviewer) => void;
	saveReviewer: (employeeId: number) => void;
}

const ReviewerList = React.createClass<ReviewerListProps, any>({
	componentDidMount() {
		this.props.getQvr();
	},

	selectedReviewer(employeeId : any){
		this.props.saveReviewer(employeeId);
	},

	render() {
		const {reviewers} = this.props;

		return (
			<div id="reviewers" className="portlet reviewers-portlet">
				<div className="portlet-title">
					<div className="caption">Reviewers</div>
				</div>
				<div className="portlet-body">
					<h4>Add a Peer Reviewer</h4>
					<div>
						<EmployeePicker id="addPeerReviewerEmployeePicker"
							buttonText="Add"
							onSelect={(employee) => this.selectedReviewer(employee.id)}
							/>
					</div>
					<br />
					{this.props.showQvr
						? <p>Rate your reviewers by selecting 1-5 stars.</p>
						: null
					}
					
					<div className="table-responsive">
						<table className="table table-condensed">
							<tbody>
								{reviewers.map((reviewer: Reviewer) => (
									<tr key={reviewer.id}>
										<td style={{ width: '15%' }}>
											<div className="reviewer-status">
												<Avatar employeeId={reviewer.employeeId} />
											</div>
										</td>
										<td style={{ width: '45%'}} className="text-middle">
                                            {reviewer.employeeName} {this.renderVendorName(reviewer) }
                                            {reviewer.isComplete
                                                ? <i className="icon-check"></i>
                                                : null
                                            }
										</td>
										<td className="text-right text-middle">
											{this.props.showQvr
												? <Rating
													rating={reviewer.qvr ? reviewer.qvr.rating : undefined}
													isDisabled={reviewer.qvr && !reviewer.qvr.rating}
													onSelected={(rating: number) => this.onRatingSelected(reviewer, rating)}
													/>
												: null
											}
										</td>
										<td style={{ width: '10%' }} className="text-right text-middle">
											{this.props.showQvr
												? <TriggerRatingModalButton qvr={reviewer.qvr} onClick={() => this.props.openRatingModal(reviewer)} />
												: null
											}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
                    <p><i className="icon-check"></i> Indicates Reviewer is done with Review</p>
				</div>
				<RatingModalContainer />
			</div>
		);
	},

	renderVendorName(reviewer: Reviewer) {
		if (reviewer.vendor) {
			return <span>({reviewer.vendor})</span>;
		}

		return null;
	},

	onRatingSelected(reviewer: Reviewer, rating: number) {
		const qvr = objectAssign({}, reviewer.qvr,
		{
			rating
		});
		
		if (qvr.comment || qvr.rating <= 2) {
			this.props.openRatingModal(reviewer, qvr.rating);
		} else {
			this.props.saveQvr(reviewer.id, qvr);
		}
	}
});

export default ReviewerList;