/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/kendo-ui/kendo-ui.d.ts" />

 module Gartner {
	 
	 export function getTemplate(templateId: string) {
		 return kendo.template($("#" + templateId).html());
	 }

 }