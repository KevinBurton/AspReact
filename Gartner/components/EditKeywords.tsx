import * as React from 'react';
import {
	FormGroup,
	TextArea,
	Label
} from './Form';

export interface EditKeywordsProps {
	keywords: string;
	onCancel: Function;
	onSave: (keywords: string) => void;
	isSaving: boolean;
}

const EditKeywords = React.createClass<EditKeywordsProps, any>({
	getInitialState() {
		return {
			keywordsTextArea: ''
		};
	},

	componentWillMount() {
		this.setState({
			keywordsTextArea: this.props.keywords
		});
	},

	render() {
		return (
			<div>
				<form>
					<FormGroup>
						<Label id="Keywords" text="Tag Name" required={false} />
						<TextArea
							value={this.state.keywordsTextArea}
							onChange={this.onKeywordsChange}
							disabled={this.props.isSaving}
							maxLength={2000} />
					</FormGroup>
				</form>
				<button type="button" id="CloseKeywordsDiv" className="btn btn-default" onClick={this.onCancel}>Cancel</button>&nbsp;
				<button type="button" id="SaveKeywords" className="btn btn-primary" onClick={this.onSave} disabled={this.props.isSaving}>
					{this.props.isSaving ? 'Saving..' : 'Save'}
				</button>
			</div>
		);
	},

	onKeywordsChange(event) {
		this.setState({
			keywordsTextArea: event.target.value
		});
	},

	onSave(event) {
		event.preventDefault();
		
		const { keywordsTextArea } = this.state;
		this.props.onSave(keywordsTextArea);
	},

	onCancel(event) {
		event.preventDefault();

		this.props.onCancel();
	}
});

export default EditKeywords;