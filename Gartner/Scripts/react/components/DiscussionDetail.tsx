import * as React from 'react';
import Avatar from './Avatar';
import { DiscussionAttachmentsContainer } from './DiscussionAttachments';
import { ComponentDescriptor } from '../models/generic';
import { toLocalDate } from '../utils/dates';

export interface DiscussionDetailProps {
	componentData: (component: Object) => void;
	discussion: Object;
	openAdd: Function;
}

export const DiscussionDetail = React.createClass<DiscussionDetailProps, any>({

	getInitialState() {
		return {
			isHidden: true
		};
	},

	componentDidUpdate() {
		$('[data-toggle="tooltip"]').tooltip();
	},

	toggleHidden() {
		this.setState(prevState => {
			return { isHidden: !prevState.isHidden }
		});
	},

	render() {

		const discussion = this.props.discussion;

		const Flag = (props) => {
			const title = toLocalDate(props.item.FlagCreatedTimeUtc.Value) + " by " + props.item.FlagCreatedByName.Value;
			return props.item.FlagValue.Value === 'Y' &&
				(<p><span className="text-danger" title={title} data-toggle="tooltip"><i className="icon-flag-critical"></i> Needs Attention</span></p>);
		};


		const Info = (props) => {
			return (<div>
				<h4 className="media-heading">
					<span>{props.item.FullName.Value}</span>
					<small className="text-muted"> ({props.item.CommenterRole.Value}) </small>
					{props.isChild &&
						(<span><span className="text-muted font-normal"> replied to </span>
							<span>{props.item.ReplyToName.Value}</span></span>)
					}
				</h4>
				<p className="wordWrap" dangerouslySetInnerHTML={{ __html: props.item.CommentDetail.Value }} />
				<DiscussionAttachmentsContainer discussion={props.item} />
				<p className="text-muted font-sm">
					<strong>Posted on </strong>
					<span className="text-muted">{toLocalDate(props.item.CreatedTimeUTC.Value)}</span>
					<button type="submit" className="btn btn-xs btn-secondary" onClick={() => this.props.openAdd(props.item)} >
						Reply
					</button>
				</p>
			</div>)
		};

		const Child = (props) => {
			return (
				<li key={props.discussion.ID.Value} className="media">
					<Avatar employeeId={props.discussion.CreatedByEmployeeId.Value} />
					<div key={props.discussion.ID.Value} className="media-body">
						<Info item={props.discussion} isChild={true} />
					</div>
				</li>);
		};


		return (
			<li className="media">
				<Avatar employeeId={discussion.CreatedByEmployeeId.Value} />
				<div className="media-body">
					<Info item={discussion} />

					{discussion.Children.length > 0 &&
						(<p className="msg_head" onClick={this.toggleHidden}>View {discussion.Children.length} Replied Comment(s)</p>)}

					{!this.state.isHidden &&
						(
							<ul className="media-list">
								{discussion.Children.map((child: any) => (
									<Child key={child.ID.Value} discussion={child} />)
								)}
							</ul>
						)}

				</div>
			</li>
		);
	}
});


export default DiscussionDetail;