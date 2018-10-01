
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import ComboBox from './kendo/ComboBox';
import { Label } from './Form';


export interface DiscussionAttachmentProps {
	discussion: any

}

export const DiscussionAttachmentsComponent = React.createClass<DiscussionAttachmentProps, any>({

	componentWillMount() {
		this.componentDescriptor = {
			name: 'DiscussionFile',
			returnObjectIndexed: false,
			dataDictionary: {
				ID: '0', DiscussionId: '0'
			}
		}
	},

	render() {

		const padRight = {
			paddingRight: '5px'
		};

		const files = this.props.files;

		return (
			<div className="form-group attachment-block">
				<div className="files-block">
					<ul className="list-unstyled attach-files" >
						{files.map((file: any, index: Number) => (
						<li key={file.ID.Value}>
							<i style={padRight} className="icon-attach"></i>
							<a href={file.Url.Value}>
								<span>{file.Name.Value}</span>
							</a>
						</li>
						))}
					</ul>
				</div>
			</div>
		);
	}
});

const mapStateToProps = (state, props) => {
	if (!state.DiscussionFile) {
		return {
			itemId: state.itemId,
			files: []
		};
	}

	return {
		itemId: state.itemId,
		files: state.DiscussionFile.filter(f => f.DiscussionId.Value === props.discussion.ID.Value)
	};
};

export const DiscussionAttachmentsContainer =
	connect(
		mapStateToProps,
		actions
	)(DiscussionAttachmentsComponent) as React.ClassicComponentClass<any>;


export default DiscussionAttachmentsComponent;

