module Gartner {

	export interface SectionLoaderOptions {
		elementId: string;
		containerId: string;
		url: string;
	}

	export class SectionLoader {

		private loaded = false;
		elementId: string;

		onReady(params: SectionLoaderOptions) {
			this.elementId = params.elementId;
			EventUtilities.addHandlerToBody("click", "#" + params.elementId, this.loadSection(params.containerId, params.url));
		}

		loadSection = (containerId: string, url: string) => {
			return () => {
				if (!this.loaded) {
					$.ajax({
						url: url,
						cache: false
					})
					.done((response) => {
						$("#" + containerId).html(response);
						this.loaded = true;
					});
				}
			}
				
		}

	}

} 