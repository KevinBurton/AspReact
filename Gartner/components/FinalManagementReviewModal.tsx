import * as React from 'react';
import Checkbox from './Checkbox';
import CheckList from './CheckList';
import CheckListRow from './CheckListRow';

declare const $;
declare const toastr;

interface FinalManagementReviewModalState {
	finalManagementReviewIsApproved: boolean;
};

const FinalManagementReviewModal = React.createClass<any, FinalManagementReviewModalState>({

	modalSelector: '#finalManagementReviewModal',

	getInitialState() {
		return {
			finalManagementReviewIsApproved: false
		};
	},

	onFinalManagementReviewApprovalChange() {
		this.setState({
			finalManagementReviewIsApproved: !this.state.finalManagementReviewIsApproved
		});
	},

	onSubmit() {
		if (this.state.finalManagementReviewIsApproved) {
			$("#promoteFromFinalManagementReview_form").submit();
			$(this.modalSelector).modal("hide");
		} else {
			toastr.clear();
			toastr.error("You must select the checkbox to confirm review", "Final Management Review");
		}
	},

	render() {
		return (
            <div className="modal-content">
				<div className="modal-body">
					<p>
						Team Manager, please review the Presentation Quality Framework below and ensure that the associated presentation
						and/or other deliverables meets the quality standards that you and the authors are expected to maintain for all
						content.
					</p>

					<CheckList title={'Structure'}>
						<CheckListRow>Overall structure promotes the storyline and leads to relevant actions.</CheckListRow>
						<CheckListRow>Presentation has a good balance of content types including text, charts, and compelling visuals.</CheckListRow>
					</CheckList>
					<CheckList title={'Content'}>
						<CheckListRow>Content on slides is consistent with title and description for presentation (if not, please have the analyst update the title & description).</CheckListRow>
						<CheckListRow>
							Fact-based evidence (GEAR, Primary/Secondary research, vendor information) is used appropriately and
							adheres to <a href= "http://intranet.gartner.com/research/creatingresearch/fbr/index.html"
								target="_blank" style={{ color: "#067b9c", textDecoration: "none" }}>usage guidance</a>.
						</CheckListRow>
					</CheckList>
					<CheckList title={'Execution'}>
						<CheckListRow>Content can be delivered within the allocated time.</CheckListRow>
						<CheckListRow>Content layout is legible and uncluttered.</CheckListRow>
					</CheckList>
					<CheckList title={'Brand'}>
						<CheckListRow>Presentation follows Gartner Research presentation template and size.</CheckListRow>
						<CheckListRow>Visuals are aligned to the Gartner brand guidelines.</CheckListRow>
					</CheckList>
					<CheckList title={'Visuals'}>
						<CheckListRow>Visuals are relevant to, and enhance the content being presented.</CheckListRow>
						<CheckListRow>Visuals are consistent to each other and from slide to slide.</CheckListRow>
					</CheckList>
					<CheckList title={'Context'}>
						<CheckListRow>Third-party content including visuals are free from any copyright restrictions.</CheckListRow>
						<CheckListRow>Slide content is presented in a universally understood context.</CheckListRow>
					</CheckList>

					<Checkbox isChecked={this.state.finalManagementReviewIsApproved} onChange={this.onFinalManagementReviewApprovalChange}>
						I have reviewed per the above and approve this content to move forward in the workflow.
					</Checkbox>
				</div>
				<div className="modal-footer">
                    <button type="button" id="btnFinalManagementReviewCancel" className="btn btn-default" data-dismiss="modal">
						Cancel
					</button>
					<button type="button" id="btnFinalManagementReviewOk" className="btn btn-primary" onClick={this.onSubmit}>
						Ok
					</button>
				</div>
			</div>
		);
	}
});

export default FinalManagementReviewModal;
