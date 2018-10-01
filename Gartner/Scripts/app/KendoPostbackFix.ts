/// <reference path="../typings/jquery/jquery.d.ts" />

module Gartner {
	
	export class KendoPostbackFix {
		
		onReady() {
			$(".k-widget").removeClass("input-validation-error");
		}

	}

} 