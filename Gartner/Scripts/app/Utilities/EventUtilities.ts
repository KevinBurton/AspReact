module Gartner.EventUtilities {
	
	export function addHandlerToBody(eventName: string, cssSelector: string, handler: (eventObject: JQueryEventObject) => any): JQuery {
		return $("body")
			.off(eventName, cssSelector)
			.on(eventName, cssSelector, handler);
	}

} 