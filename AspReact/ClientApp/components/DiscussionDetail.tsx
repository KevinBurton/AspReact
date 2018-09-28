import * as React from 'react';
import Avatar from './Avatar';
import DiscussionReplyModal from './DiscussionReplyModal';
import { ComponentDescriptor } from '../models/componentDescriptor';
import * as $ from "jquery";

export interface DiscussionDetailProps {
	discussionToReplyTo: Object;
	discussionToReplyToProps: Object;
	discussionToReplyToComponentDescriptor: ComponentDescriptor;
	replyCompleted: boolean;
}

export const DiscussionDetail = React.createClass<DiscussionDetailProps, any>({

    openReply: function (discussionToReplyTo: any) {
        var destination = "#showDiscussionReplyModal" + discussionToReplyTo.ID.Value;
        var result = $(destination).trigger("click");
    },

    modalSelector: '#showDiscussionReplyModal',
    toLocalDate: function (date: Date): string {
        var d = new Date(date+" UTC");
        var dateString = ("0" + d.getDate()).slice(-2) + " " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] + " " + d.getFullYear() + ", " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        return dateString;
    },
	render() {

		const discussionToReplyTo = this.props.discussionToReplyTo;


		return (
			<div className="input-group">
				<table className="table table-condensed">
					<tbody>
						<tr key={discussionToReplyTo.ID.Value}>
							<td>
								<Avatar employeeId={discussionToReplyTo.CreatedByEmployeeId.Value} />&nbsp;
								<strong>{discussionToReplyTo.FullName.Value}</strong> ({discussionToReplyTo.CommenterRole.Value})&nbsp;
								<span dangerouslySetInnerHTML={{ __html: discussionToReplyTo.CommentDetail.Value }} />
							</td>
							<td>
								<DiscussionReplyModal
									discussionToReplyTo={discussionToReplyTo}
									discussionToReplyToProps={this.props.discussionToReplyToProps}
									discussionToReplyToComponentDescriptor={this.props.discussionToReplyToComponentDescriptor}
									replyCompleted={false} />
							</td>
						</tr>
						<tr >
							<td>
                                Posted On {this.toLocalDate(discussionToReplyTo.CreatedTimeUTC.Value)}
								<button type="submit" className="btn-link btn-action" onClick={() => this.openReply(discussionToReplyTo) }  >
									Reply
								</button>
							</td>
						</tr>

					</tbody>
				</table>
			</div>
		);
	}
});


export default DiscussionDetail;
