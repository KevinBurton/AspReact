
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/generic';
import { Label } from './Form';
import EmployeePicker from './EmployeePicker';
import Avatar from './Avatar';
import DiscussionDetail from './DiscussionDetail';
import DiscussionAddModal from './DiscussionAddModal';
import { ApplicationState }  from '../store';
import * as DiscussionStore from '../store/Discussion';

export interface DiscussionProps {
	Discussion?: Object;
}

export const Discussion = React.createClass<DiscussionProps, any>({

	componentWillMount() {
		this.componentDescriptor = {
			name: 'Discussion',
			returnObjectIndexed: false,
			dataDictionary: {
				ID: '0', ItemId: '', CommentDetail: '', FlagValue: '', ParentId: ''
			}
		}
		this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
		this.props.componentData(this.componentDescriptor, 'GetData');
	},

	openAdd: function () {
		var result = $("#showDiscussionAddModal").trigger("click");
	},

	render() {


		const Discussion = this.props.Discussion;
		return (
			<div id="Discussion">
				<div className="form-group">
					<span>
						<DiscussionAddModal discussionToAdd={Discussion} discussionToAddToProps={this.props}
							discussionToAddToComponentDescriptor={this.componentDescriptor} replyCompleted={false} />
                    </span>
					<button type="submit" className="btn-link btn-action" onClick={() => this.openAdd() }  >
						Add Comment
					</button>
					<div>
						{Discussion[0].ID.Value != '0' ?
							Discussion.map((Discussion: any) => (
								<div key={Discussion.ID.Value}>
									{Discussion.ParentId.Value == '' ?
                                        <span>
											<DiscussionDetail discussionToReplyTo ={Discussion} discussionToReplyToProps={this.props}
												discussionToReplyToComponentDescriptor={this.componentDescriptor} replyCompleted={false}/>
										</span>
										:
                                        <span width="30%">
											<DiscussionDetail discussionToReplyTo ={Discussion} discussionToReplyToProps={this.props}
												discussionToReplyToComponentDescriptor={this.componentDescriptor} replyCompleted={false}/>
										</span>}
                                </div>
							)
							)
							: <div></div>
						}

					</div>
				</div>
			</div>
		);
	}
});

const mapStateToProps = (state: any) => {
	if (!state.Discussion) {
		return {
			itemId: state.itemId,
			Discussion: [
			{
			    ID: {
			        Value: '0'
			    },
			    ItemId: {
			        Value: ''
			    },
			    Subject: {
			        Value: ''
			    },
			    CommentDetail: {
			        Value: ''
			    },
			    CommenterRole: {
			        Value: ''
			    },
			    CreatedByEmployeeId: {
			        Value: ''
			    },
			    FullName: {
			        Value: ''
			    },
			    CreatedTimeUTC: {
			        Value: ''
			    },
			    ParentId: {
			        Value: ''
			    },
			    FlagValue: {
			        Value: ''
			    },
			    AllowedToUploadFile: {
			        Value: ''
			    },
			    Attachments:[
                {
                    Value: ''
                }]
			}]
		};
	}

	return {
		itemId: state.itemId,
		Discussion: state.Discussion
	};
};

// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState) => state.discussion, // Selects which state properties are merged into the component's props
  DiscussionStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Discussion) as typeof Discussion;
