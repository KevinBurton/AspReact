
import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/componentDescriptor';
import DiscussionDetail from './DiscussionDetail';
import DiscussionAddModal from './DiscussionAddModal';
import { ApplicationState }  from '../store';
import * as DiscussionStore from '../store/Discussion';

export interface DiscussionProps {
	Discussion?: Object;
	componentData?: (a:ComponentDescriptor, b:string) => void;
}

class Discussion extends React.Component<DiscussionProps, any> {
 	componentDescriptor: any;
	constructor(props: any) {
		super(props);
		this.componentDescriptor = {
			name: 'Discussion',
			returnObjectIndexed: false,
			dataDictionary: {
				ID: '0', ItemId: '', CommentDetail: '', FlagValue: '', ParentId: ''
			}
		};
		this.openAdd = this.openAdd.bind(this);
	}

	componentWillMount() {
		this.props.componentData(this.componentDescriptor, 'GetData');
	}

	openAdd() {
		var result = $("#showDiscussionAddModal").trigger("click");
	}

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
						{Discussion && (<any[]>Discussion)[0] && Discussion[0].ID.Value != '0' ?
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
}

// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState) => state.discussion, // Selects which state properties are merged into the component's props
  DiscussionStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Discussion) as typeof Discussion;
