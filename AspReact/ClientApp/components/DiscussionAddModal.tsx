import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as ajax from '../utils/ajax';
import { ComponentDescriptor } from '../models/componentDescriptor';
import { IOption } from '../models/IOption';
import { Input, FormGroup, TextArea, Label } from './Form';
import Avatar from './Avatar';
import { CKEditor } from './CKEditor';

interface DiscussionAddModalState {

	replyCompleted: boolean;
};

export interface DiscussionAddModalProps {

	discussionToAdd: Object;
	discussionToAddToProps: Object;
	discussionToAddToComponentDescriptor: ComponentDescriptor;
	replyCompleted: boolean;
}


export const DiscussionAddModalComponent = React.createClass<DiscussionAddModalProps, DiscussionAddModalState>({

	getInitialState() {
		return {
			replyCompleted: false,
			commentDetail: ''
		};
	},

	componentDidMount() {
		var self = this;
		$('#DiscussionAddPopUp').on('hidden.bs.modal', function (e) {
			self.setState({
				commentDetail: ''
			});
		});

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
		this.props.discussionToAddToComponentDescriptor.dataDictionary['ID'] = '';
		this.props.discussionToAddToComponentDescriptor.dataDictionary['ItemId'] = this.props.discussionToAddToProps.itemId;
		this.props.discussionToAddToComponentDescriptor.dataDictionary['CommentDetail'] = encodeURIComponent(this.state.commentDetail.trim());
        this.props.discussionToAddToComponentDescriptor.dataDictionary['EmployeeId'] = 'UseModifiedByUserId';
        this.props.discussionToAddToComponentDescriptor.dataDictionary['CommenterRole'] = 'UseUserRoles';

		this.props.discussionToAddToProps.componentData(this.props.discussionToAddToComponentDescriptor, 'Upsert');
	},

	render() {

		return (
			<div>
				<a href="#" id={"showDiscussionAddModal"} data-toggle="modal" hidden={true} data-target={"#DiscussionAddPopUp"}></a>
                <div className="modal fade" id={"DiscussionAddPopUp"} tabIndex={-1} role="dialog">
					<div className="modal-dialog modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title">Add Comment</h4>
							</div>
							<div className="modal-body">
								<table className="table table-condensed">
									<tbody>
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
								<button type="button" id="btnDiscussionAddCancel" className="btn btn-default" data-dismiss="modal">
									Cancel
								</button>
								<button type="button" id="btnDiscussionAddOk" className="btn btn-primary" data-dismiss="modal" onClick={this.upsertChange} >
									Add
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

export const DiscussionAddModalContainer =
	connect(
		mapStateToProps,
		actions
	)(DiscussionAddModalComponent as React.ClassicComponentClass<any>);


export default DiscussionAddModalComponent;



