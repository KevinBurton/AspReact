
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import ComboBox from './kendo/ComboBox';
import { Label } from './Form';
import EmployeePicker from './EmployeePicker';
import Avatar from './Avatar';
import DiscussionDetail from './DiscussionDetail';
import DiscussionAddModal from './DiscussionAddModal';


export interface DiscussionProps {
	getComponentData: (component: Object) => void;
	Discussion: Object;
	componentDescriptor: ComponentDescriptor;

}

export const DiscussionComponent = React.createClass<DiscussionProps, any>({

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

const mapStateToProps = (state) => {
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

export const DiscussionContainer =
	connect(
		mapStateToProps,
		actions
	)(DiscussionComponent) as React.ClassicComponentClass<any>;


export default DiscussionComponent;

