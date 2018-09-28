import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { IOption } from '../models/IOption';
import { Input, FormGroup, TextArea, Label } from './Form';
import Avatar from './Avatar';
import { CKEditor } from './CKEditor';
import * as $ from "jquery";

interface DiscussionReplyModalState {

	replyCompleted: boolean;
};

export interface DiscussionReplyModalProps {

	discussionToReplyTo: Object;
	discussionToReplyToProps: Object;
	discussionToReplyToComponentDescriptor: ComponentDescriptor;
	replyCompleted: boolean;
}


export const DiscussionReplyModalComponent = React.createClass<DiscussionReplyModalProps, DiscussionReplyModalState>({

	getInitialState() {
		return {
			replyCompleted: false,
			commentDetail: ''
		};
	},

	componentDidMount() {
		var _this = this;
		$("#DiscussionReplyPopUp" + this.props.discussionToReplyTo.ID.Value).on('hidden.bs.modal', function (e) {
			_this.setState({
				commentDetail: ''
			});
		})
	},

	onreplyCompleted() {
		this.setState({
			replyCompleted: !this.state.replyCompleted
		});
	},

	onCommentChange(e) {
		this.setState({
			commentDetail: e.editor.getData()
		});
	},


	upsertChange: function (e) {
		var discussionToReplyTo = this.props.discussionToReplyTo;

		this.props.discussionToReplyToComponentDescriptor.dataDictionary['ID'] = '';
		this.props.discussionToReplyToComponentDescriptor.dataDictionary['ItemId'] = this.props.discussionToReplyToProps.itemId;
		this.props.discussionToReplyToComponentDescriptor.dataDictionary['ParentId'] = discussionToReplyTo.ID.Value;
		this.props.discussionToReplyToComponentDescriptor.dataDictionary['CommentDetail'] = encodeURIComponent(this.state.commentDetail.trim());
        this.props.discussionToReplyToComponentDescriptor.dataDictionary['EmployeeId'] = 'UseModifiedByUserId';
        this.props.discussionToReplyToComponentDescriptor.dataDictionary['CommenterRole'] = 'UseUserRoles';

		this.props.discussionToReplyToProps.componentData(this.props.discussionToReplyToComponentDescriptor, 'Upsert');
	},

	render() {

		const discussionToReplyTo = this.props.discussionToReplyTo;

		return (
			<div>
				<a href="#" id={"showDiscussionReplyModal" + discussionToReplyTo.ID.Value} data-toggle="modal" hidden={true} data-target={"#DiscussionReplyPopUp" + discussionToReplyTo.ID.Value}></a>
                <div className="modal fade" id={"DiscussionReplyPopUp" + discussionToReplyTo.ID.Value} tabIndex={-1} role="dialog">
					<div className="modal-dialog modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title">Replying</h4>
							</div>
							<div className="modal-body">
								<table className="table table-condensed">
									<tbody>
										<tr  key={discussionToReplyTo.ID.Value}>
											<td>
												<Avatar employeeId={discussionToReplyTo.CreatedByEmployeeId.Value} /> <strong>{discussionToReplyTo.FullName.Value}</strong>({discussionToReplyTo.CommenterRole.Value}) {discussionToReplyTo.CommentDetail.Value}
											</td>
										</tr>
										<tr >
											<td>
												Posted On {discussionToReplyTo.CreatedTimeUTC.Value}
											</td>
										</tr>
										<tr >
											<td>
												<CKEditor
													activeClass="editor"
													content={this.state.commentDetail}
													events={{
														change: this.onCommentChange
													}}
													/>
											</td>
										</tr>
									</tbody>
								</table>

							</div>
							<div className="modal-footer">
								<button type="button" id="btnDiscussionReplyCancel" className="btn btn-default" data-dismiss="modal">
									Cancel
								</button>
								<button type="button" id="btnDiscussionReplyOk" className="btn btn-primary" data-dismiss="modal" onClick={this.upsertChange} >
									Reply
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

const mapStateToProps = (state) => {
	if (!state) {
		const { itemId } = state;

		return {
			itemId: state.itemId,
			replyCompleted: state.replyCompleted
		};
	}

	return {
		itemId: state.itemId,
		replyCompleted: state.replyCompleted
	};
};

export const DiscussionReplyModalContainer =
	connect(
		mapStateToProps,
		actions
	)(DiscussionReplyModalComponent as React.ClassicComponentClass<any>);


export default DiscussionReplyModalComponent;



