import * as React from 'react';

export const DiscussionFileUpload = React.createClass<any, any>({
	getInitialState() {
		return {
			files: []
		}
	},
	uploadInput: null,
	fileName: null,
	onSelectFiles(e) {
		this.props.onSelectFiles(e.target.files);
	},

	render() {

		const styles = {
			paddingRight: '5px'
		};

		const topSpacing = {
			marginTop: '15px'
		};

		return (
			<div style={topSpacing} className="form-group">
				<h4>
					<span style={styles}>Attachment(s)</span>
					<label className="btn btn-primary btn-file">
						Attach Files
						<input type="file"
							className="hidden"
							onChange={this.onSelectFiles}
							onClick={(event) => {
								event.target['value'] = null
							} }
							multiple />
					</label>
				</h4>
			</div>
		)
	}
});

export default DiscussionFileUpload;