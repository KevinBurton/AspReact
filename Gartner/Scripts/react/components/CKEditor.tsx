/*

Usage:

	<CKEditor
		activeClass="editor"
		content={this.props.content}
		events={{
			blur: this.onBlur,
			afterPaste: this.afterPaste,
			change: this.onChange
		}}
	/>

*/

import * as React from "react";
import * as ReactDOM from "react-dom";

declare global {
	interface Window {
		CKEDITOR: any
	}
}

export interface CKEditorProps {
	content: String,
	config?: any,
	activeClass?: String
	events?: any,
	id: any,
	name: any
}

export const CKEditor = React.createClass<CKEditorProps, any>({

	unmounting: false,
	editorInstance: null,

	getInitialState: function () {
		return { config: this.props.config };
	},

	componentDidMount() {
		this.onLoad();
	},

	componentWillUnmount() {
		this.unmounting = true;
	},

	componentDidUpdate() {
		if (this.editorInstance && this.editorInstance.getData() !== this.props.content) {
			this.editorInstance.setData(this.props.content);
		}
	},

	onLoad() {
		if (this.unmounting) return;

		if (!window.CKEDITOR) {
			console.error("CKEditor not found");
			return;
		}

		this.editorInstance = window.CKEDITOR.replace(
			ReactDOM.findDOMNode(this),
			this.state.config,
			this.props.content
		);

		//Register listener for custom events if any
		for (var event in this.props.events) {
			var eventHandler = this.props.events[event];

			this.editorInstance.on(event, eventHandler);
		}
	},

	render() {
		return <textarea id={this.props.id} name={this.props.name} className={this.props.activeClass} rows="10" cols="80"></textarea>;
	}
});