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
	content: string,
	config?: any,
	activeClass?: string
	events?: any
}

// https://stackoverflow.com/questions/44369706/react-typescript-usage-of-classname-prop
export class CKEditor extends React.Component<CKEditorProps & React.HTMLAttributes<HTMLTextAreaElement>, any> {
	constructor(props: any) {
		super(props);
		this.unmounting = false;
		this.editorInstance = null;
		// This binding is necessary to make 'this'work in the callback
		this.getInitialState = this.getInitialState.bind(this);
		this.onLoad = this.onLoad.bind(this);
	}
	unmounting: boolean;
	editorInstance: any;

	getInitialState() {
		return { config: this.props.config };
	}

	componentDidMount() {
		this.onLoad();
	}

	componentWillUnmount() {
		this.unmounting = true;
	}

	componentDidUpdate() {
		if (this.editorInstance && this.editorInstance.getData() !== this.props.content) {
			this.editorInstance.setData(this.props.content);
		}
	}

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
	}

	render() {
		return <textarea className={this.props.activeClass} rows={10} cols={80}></textarea>;
	}
});