module Gartner {
	export class EnableSelectPickers {
		onReady() {
			(<any>$("select[name='default']")).selectpicker({ style: "dd-default" });
		}
	}
} 