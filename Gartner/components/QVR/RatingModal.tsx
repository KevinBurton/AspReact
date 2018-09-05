import * as React from 'react';
import { findDOMNode } from 'react-dom';

import {Qvr, Reviewer, Reason} from '../../models/qvr';
import Avatar from '../Avatar';
import Rating from './Rating';
import CheckBox from '../CheckBox';
import { TextArea } from '../Form';

export interface RatingModalProps {
	getReasons: Function;
	closeRatingModal: Function;
	modalRatingSelected: (rating?: number) => void;
	saveModalQvr: () => void;
	didNotProvidePeerReviewChanged: (didNotProvide: boolean) => void;
	modalCommentChanged: (comment: string) => void;
	reasonChanged: (reasonId?: number) => void;

	reasons: Reason[];
	isOpen: boolean;
	isSaving: boolean;
	canSaveModal: boolean;
	commentIsRequired: boolean;
	reasonIsRequired: boolean;
	reviewer?: Reviewer;
	rating?: number;
	comment?: string;
	reasonId?: number;
	hasNoPeerReviewProvided: boolean;
}

const RatingModal = React.createClass<RatingModalProps, any>({
	componentDidMount() {
		this.props.getReasons();
		this.showOrHideModal();
	},

	componentDidUpdate() {
		this.showOrHideModal();
	},

	showOrHideModal() {
		$(findDOMNode(this)).modal(this.props.isOpen ? 'show' : 'hide');
	},

	render() {
		const { reviewer } = this.props;

		return (
			<div className="modal fade" id="addPeerRatingModel" tabIndex={-1} role="dialog" aria-hidden="false" data-backdrop="static" data-keyboard="false">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Peer Rating</h4>
							<p>Rate your reviewers by selecting 1-5 stars. For ratings 2 stars or under, please add a comment.</p>
						</div>
						<div className="modal-body">
							<form className="form-compact">
								{reviewer && this.renderReviewerSummary()}
								{reviewer && this.renderDidNotProvidePeerReview()}
								{reviewer && this.renderReasons()}
								{reviewer && this.renderComments()}
							</form>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={this.props.closeRatingModal}
								disabled={this.props.isSaving}>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={this.props.saveModalQvr}
								disabled={!this.props.canSaveModal}>
								{this.props.isSaving ? 'Saving..' : 'Rate Reviewer'}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	renderReviewerSummary() {
		const { reviewer, rating, hasNoPeerReviewProvided, modalRatingSelected } = this.props as RatingModalProps;

		return (
			<div className="table-responsive">
				<table className="table table-condensed">
					<tbody>
						<tr>
							<td>
								<Avatar employeeId={reviewer.employeeId} />
							</td>
							<td className="text-middle">
								{reviewer.employeeName} {reviewer.vendor ? <span>({reviewer.vendor})</span> : null}
							</td>
							<td className="text-center text-middle">
								<span className="text-muted">
									{reviewer.reviewerTypeId === 2 ? 'Mandatory' : 'Peer'}
								</span>
							</td>
							<td className="text-right text-middle">
								<Rating
									rating={rating}
									isDisabled={hasNoPeerReviewProvided}
									onSelected={modalRatingSelected}
									/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	},

	renderDidNotProvidePeerReview() {
		const { hasNoPeerReviewProvided } = this.props as RatingModalProps;
		return (
			<CheckBox
				noForm={true}
				isChecked={hasNoPeerReviewProvided}
				onChange={() => this.props.didNotProvidePeerReviewChanged(!hasNoPeerReviewProvided)}>
				Did not provide peer review
			</CheckBox>
		);
	},

	renderReasons() {
		if (this.props.hasNoPeerReviewProvided) {
			const { reasons, reasonId } = this.props as RatingModalProps;

			const selectedValue = reasonId !== undefined && reasonId !== null
				? reasonId.toString()
				: '';

			const selectOptions = [<option key={''} value={''}>-- Select --</option>]
				.concat(reasons.map(reason => <option key={reason.Id} value={reason.Id.toString()}>{reason.Name}</option>));

			return (
				<div id="reason-block" className="form-group">
					<label className="control-label">Reason no peer review provided <span className="orange">*</span></label>
					<select className="form-control" value={selectedValue} onChange={(event: any) => {
						const newReasonId = event.target.value ? parseInt(event.target.value) : undefined;
						this.props.reasonChanged(newReasonId);
					}}>
						{selectOptions}
					</select>
				</div>
			);
		}

		return null;
	},

	renderComments() {
		const { comment, isSaving, commentIsRequired } = this.props as RatingModalProps;

		return (
			<div className="form-group">
				<label>Comments {commentIsRequired && <span className="orange">*</span>}</label>
				<TextArea
					value={comment || ''}
					onChange={(event) => this.props.modalCommentChanged(event.target.value)}
					disabled={isSaving}
					maxLength={250} />
				<span className="text-danger field-validation-error">
					{commentIsRequired && "Star ratings of 1 or 2 require a comment."}
				</span>
			</div>
		);
	}

});

export default RatingModal;
