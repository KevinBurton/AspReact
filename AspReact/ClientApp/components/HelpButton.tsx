import * as React from 'react';
import { findDOMNode } from 'react-dom';

declare var $: any;

export interface HelpButtonProps {
	text: string;
	title: string;
}

const HelpButton = React.createClass<HelpButtonProps, any>({
	closeButtonId: undefined,
	render() {
		return (
			<a>
				<span id={this.props.title} className="icon-help"></span>
			</a>
		);
    },

	componentDidMount() {
        const domNode = findDOMNode(this);
        this.closeButtonId = `${this.props.title.replace(/\s/g, '')}HelpCloseButton`;

	    $(domNode).popover({
	        container: "body",
	        content: this.props.text,
	        placement: "left",
	        title: this.props.title + `<button id="${this.closeButtonId}" type='button' class='close'>&times;</button>`,
	        html: true
	    });
        

	    $('body')
	        .on('click',
	            `#${this.closeButtonId}`,
	            () => {
	                $(domNode).popover('hide');
	            });
	},

	componentWillUnmount() {
		if (this.closeButtonId) {
			$('body')
				.off('click',
					`#${this.closeButtonId}`);
		}	
	}
});

export default HelpButton;