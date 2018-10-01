module Gartner {
	export class EnableTooltips {
		onReady() {
			(<any>$('[data-toggle="tooltip"]')).tooltip();
		}
	}
}