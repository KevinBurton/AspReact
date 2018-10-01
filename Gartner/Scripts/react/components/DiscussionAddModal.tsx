import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import * as ajax from '../utils/ajax';
import { ComponentDescriptor } from '../models/generic';
import Avatar from './Avatar';
import { CKEditor } from './CKEditor';
import DiscussionFileUpload from './DiscussionFileUpload';
import CheckBox from './CheckBox';
import { toLocalDate } from '../utils/dates';

interface DiscussionAddModalState {
	replyCompleted: boolean;
};

export interface DiscussionAddModalProps {
	itemId: Number;
	componentDescriptor: ComponentDescriptor;
	filesComponentDescriptor: ComponentDescriptor;
	replyCompleted: boolean;
	replyTo?: Object;
	allowAttachments: boolean;
}

export const DiscussionAddModalComponent = React.createClass<DiscussionAddModalProps, DiscussionAddModalState>({

	getInitialState() {
		return {
			replyCompleted: false,
			commentDetail: '',
			needsAttention: false,
			files: []
		};
	},

	componentDidMount() {
		var self = this;
		$('#DiscussionAddPopUp')
			.on('show.bs.modal', function (e) {
				self.setState(self.getInitialState());
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

	onCheckNeedsAttention() {
		this.setState({
			needsAttention: !this.state.needsAttention
		});
	},

	upsertChange: function (e) {
		this.saveAttachments()
			.fail(() => {
				toastr.error('Failed to save attachment(s)!');
			})
			.done((attachments) => {
				this.props.componentDescriptor.dataDictionary['ID'] = '';
				this.props.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
				this.props.componentDescriptor.dataDictionary['CommenterRole'] = 'UseUserRoles';
				this.props.componentDescriptor.dataDictionary['CommentDetail'] = encodeURIComponent(this.state.commentDetail.trim());
				this.props.componentDescriptor.dataDictionary['EmployeeId'] = 'UseModifiedByUserId';
				this.props.componentDescriptor.dataDictionary['NeedsAttention'] = this.state.needsAttention;
				this.props.componentDescriptor.dataDictionary['ParentId'] = this.props.replyTo
					? this.props.replyTo.ID.Value
					: '';

				this.props.componentData(this.props.componentDescriptor, 'Upsert', (newDiscussion: any) => {
					if (attachments) {
						var vm = {
							Id: newDiscussion.ID.Value,
							EntityId: newDiscussion.ItemId.Value,
							Files: attachments
						}

						ajax.post<any>('/Discussion/Attachments', JSON.stringify(vm))
							.then(() => {
								this.props.componentData(this.props.filesComponentDescriptor, 'GetData');
							});
					}
				});
			});
	},

	saveAttachments: function (): JQueryPromise<any> {
		if (this.state.files.length === 0) {
			return $.Deferred().resolve();
		}

		const data = new FormData();
		this.state.files.forEach((_attachment, i) => {
			data.append(`file${i}`, this.state.files[i].file);
		});

		return ajax.postWithSettings<any>({
			url: '/Discussion/UploadDiscussionFile?id=' + this.props.itemId,
			type: 'POST',
			data: data,
			contentType: false,
			cache: false,
			processData: false
		});
	},

	onSelectFiles: function (files) {
		let filesArray = [...this.state.files];
		for (var i = 0; i < files.length; i++) {
			filesArray.push({
				name: files[i].name,
				file: files[i]
			});
		}
		this.setState({ files: filesArray });
	},

	removeFile: function (index) {
		this.setState(prevState => ({
			files: this.state.files.filter((_, i) => i !== index)
		})
		);
	},

	render() {

		const padRight = {
			paddingRight: '5px'
		};

		const fileListItems = this.state.files.map((d, index) => {
			return (
				<li key={index}>
					<i style={padRight} className="icon-attach"></i>
					<span style={padRight}>{d.name}</span>
					<a href="#" className="text-muted" onClick={() => this.removeFile(index)}>
						<i className="fui-cross"></i>
					</a>
				</li>)
		});

		const replyMessage = this.props.replyTo && (
			<ul className="media-list media-sm media-dotted">
				<li className="media">
					<Avatar useBlockDisplay={false} employeeId={this.props.replyTo.CreatedByEmployeeId.Value} />
					<div key={this.props.replyTo.ID.Value} className="media-body">
						<h4 className="media-heading">
							<span>{this.props.replyTo.FullName.Value}</span>
							<small className="text-muted"> ({this.props.replyTo.CommenterRole.Value}) </small>
						</h4>
						<p className="wordWrap" dangerouslySetInnerHTML={{ __html: this.props.replyTo.CommentDetail.Value }} />
						<p className="text-muted font-sm">
							<strong>Posted on </strong>
							<span className="text-muted">{toLocalDate(this.props.replyTo.CreatedTimeUTC.Value)}</span>
						</p>
					</div>
				</li>
			</ul>);

		const composerContainerStyles = {
			marginLeft: this.props.replyTo ? '50px' : '0px'
		}

		return (
			<div>
				<div className="modal fade" id={"DiscussionAddPopUp"} role="dialog">
					<div className="modal-dialog modal-lg" role="dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								<h4 className="modal-title">
									{this.props.replyTo ? 'Reply Comment' : 'Add Comment'}
								</h4>
							</div>
							<div className="modal-body allComments">
								<div>
									{replyMessage}
									<div style={composerContainerStyles}>
										<div className="form-group">
											<label htmlFor="addCommentThread">Comment</label>
											<CKEditor
												id="addCommentThread"
												name="addCommentThread"
												activeClass="editor"
												content={this.state.commentDetail}
												events={{
													change: this.onCommentChange
												}}
											/>
										</div>
										{false && (<div className="form-group" >
											<CheckBox
												noForm={true}
												isChecked={this.state.needsAttention}
												onChange={this.onCheckNeedsAttention} >
												Need Author's Attention
											</CheckBox>
										</div>)}
										{this.props.allowAttachments &&
											<DiscussionFileUpload onSelectFiles={this.onSelectFiles} />
										}
										<div>
											<ul className="list-unstyled attach-files" >
												{fileListItems}
											</ul>
										</div>
									</div>
								</div>

							</div>
							<div className="modal-footer">
								<button type="button" id="btnDiscussionAddCancel" className="btn btn-default" data-dismiss="modal">
									Cancel
								</button>
								<button type="button" id="btnDiscussionAddOk" className="btn btn-primary" data-dismiss="modal" onClick={this.upsertChange} >
									Save Comment
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
			itemId: itemId,
			replyCompleted: false,
			needsAttention: false,
			files: []
		};
	}

	return {
		itemId: state.itemId,
		replyCompleted: state.replyCompleted,
		needsAttention: state.needsAttention,
		files: state.files
	};
};

export const DiscussionAddModalContainer =
	connect(
		mapStateToProps,
		actions
	)(DiscussionAddModalComponent as React.ClassicComponentClass<any>);

export default DiscussionAddModalComponent;

