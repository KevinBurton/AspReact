
import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import DiscussionDetailContainer from './DiscussionDetail';
import { DiscussionAddModalContainer } from './DiscussionAddModal';
import objectAssign from '../utils/objectAssign';

export interface DiscussionProps {
	getComponentData: (component: Object) => void;
	Discussion: Object;
	componentDescriptor: ComponentDescriptor;
}

export const DiscussionComponent = React.createClass<DiscussionProps, any>({

	getInitialState() {
		return {
			discussionToReplyTo: null
		}
	},

	componentWillMount() {
		this.componentDescriptor = {
			name: 'Discussion',
			returnObjectIndexed: false,
			dataDictionary: {
				ID: '0', ItemId: this.props.itemId, CommentDetail: ''
			}
		}
		this.componentDescriptorFiles = {
			name: 'DiscussionFile',
			returnObjectIndexed: false,
			dataDictionary: {
				ID: '0', ItemId: this.props.itemId
			}
		};

		this.props.componentData(this.componentDescriptor, 'GetData');

		this.props.componentData(this.componentDescriptorFiles, 'GetData');
	},

	openAdd: function (replyTo) {
		this.setState({
			discussionToReplyTo: replyTo
		});
		var result = $('#DiscussionAddPopUp').modal('show');
	},

	render() {

		const badgeStyle = {
			marginLeft: "5px"
		};

		const AddCommentButton = () => (
			<p className="last pull-right">
				<button type="button" className="btn btn-sm btn-primary" onClick={() => this.openAdd()} >
					Add a Comment
				</button>
			</p>
		);

		const discussions = this.props.discussions;


		return (
			<div id="discussion-thread">
				<h3>Comments</h3>
				<div className="clearfix"></div>
				<div className="panel-group" id="comments-accordion">
					<DiscussionAddModalContainer
						itemId={this.props.itemId}
						replyTo={this.state.discussionToReplyTo}
						componentDescriptor={this.componentDescriptor}
						filesComponentDescriptor={this.componentDescriptorFiles}
						allowAttachments={this.props.allowAttachments}
						replyCompleted={false} />
					<div className="panel panel-default">
						<div className="panel-heading">
							<span>Total Comments</span>
							<span style={badgeStyle} className="badge badge-info">{this.props.totalComments}</span>
						</div>
						<div className="panel-expand expand">
							<div className="panel-body">
								<div className="tab-container">
									<div className="tab-content">
										<div className="tab-pane allComments active">
											<ul className="media-list">
												<li key="add1" className="media">
													<AddCommentButton />
												</li>
												{discussions.map((item: any) => (
													<DiscussionDetailContainer
														key={item.ID.Value}
														componentData={this.props.componentData}
														openAdd={this.openAdd}
														discussion={item} />
												)
												)}
												{discussions && discussions.length > 0 &&
													(
														<li key="add2" className="media">
															<AddCommentButton />
														</li>
													)}
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

const cleanDiscussions = (discussions) => discussions.filter(d => d.ID.Value && d.ID.Value !== '0')

const mapDiscussions = (discussions: any[]) => {
	var items = [];
	var rootCounter = -1;
	for (var index = 0; index < discussions.length; index++) {
		var discussion = discussions[index];
		if (!discussion.ParentId.Value) {
			rootCounter++;
			items.push(objectAssign({}, discussion, { Children: [] }));
		}
		else {
			items[rootCounter].Children.push(discussion);
		}
	}
	return items;
};

const mapStateToProps = (state) => {
	if (!state.Discussion) {
		return {
			itemId: state.itemId,
			allowAttachments: false,
			totalComments: 0,
			discussions: []
		};
	}

	const discussions = cleanDiscussions(state.Discussion)

	return {
		itemId: state.itemId,
		totalComments: discussions.length,
		allowAttachments: state.Discussion[0].ActionButton.IsEnabled,
		discussions: mapDiscussions(discussions)
	};
};

export const DiscussionContainer =
	connect(
		mapStateToProps,
		actions
	)(DiscussionComponent) as React.ClassicComponentClass<any>;


export default DiscussionComponent;

