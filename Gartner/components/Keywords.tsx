import * as React from 'react';
import HelpButton from './HelpButton';
import EditKeywords from './EditKeywords';

const helpText = "Hashtags are optional. Enter hashtags in a comma separated list for content classification." +
	" You must enter the hash/pound sign (“#”) on the hashtags entered in this area. Click Save when you are done.";

export interface KeywordsProps {
	keywords: string;
	isEditing: boolean;
	isReadOnly: boolean;
	onEdit: Function;
	onCancel: Function;
	onSave: (keywords: string) => void;
	getKeywords: Function;
}

export const Keywords = React.createClass<KeywordsProps, any>({
	renderEditButton() {
		return (
			<a className="btn-link" href="#" id="Edit Keywords" onClick={this.onEdit}>
				<span className="icon-edit"></span>
			</a>
		);
	},
	render() {
		const showEditButton = !this.props.isEditing && !this.props.isReadOnly;

		return (
			<div id="keywords" className="portlet">
				<div className="portlet-title">
					<div className="caption">
						Hashtags
					</div>
					<div className="actions">
						<HelpButton title="Hashtags" text={helpText} />
						{showEditButton ? this.renderEditButton() : undefined}
					</div>
				</div>
				<div className="portlet-body">
					{this.props.isEditing
						? <EditKeywords
							keywords={this.props.keywords}
							onCancel={this.props.onCancel}
							onSave={this.props.onSave}
							isSaving={this.props.isSaving} />
						: this.props.keywords}
				</div>
			</div>
		);
	},

	onEdit(event) {
		event.preventDefault();
		this.props.onEdit();
	},
	
	componentDidMount() {
		this.props.getKeywords();
	}
});

export default Keywords;