/// <reference path="../typings/jquery/jquery.d.ts" />

interface MoreLessCollapserParam {
	moreButtonId: string;
	lessButtonId: string;
	moreTextContainerId: string;
}

module Gartner {

	export class MoreLessCollapser {
		private moreTextContainerId: string;
        private moreButtonId: string;
        private lessButtonId: string;

        onReady(json: MoreLessCollapserParam) {
            this.moreTextContainerId = json.moreTextContainerId;
            this.moreButtonId = json.moreButtonId;
            this.lessButtonId = json.lessButtonId;

            if (json.moreButtonId !== undefined) {
                $("body").on("click", "[id='" + this.moreButtonId + "']", this.show);
            }

            if (json.lessButtonId !== undefined) {
                $("body").on("click", "[id='" + this.lessButtonId + "']", this.collapse);
            }
		}	

        show = () => {
            this.tryShowElement(this.moreTextContainerId);
            this.tryHideElement(this.moreButtonId);
            this.tryShowElement(this.lessButtonId);
		}

        collapse = () => {
            this.tryHideElement(this.moreTextContainerId);
            this.tryShowElement(this.moreButtonId);
            this.tryHideElement(this.lessButtonId);
        }

        tryShowElement = (elementId: string) => {
            if (elementId !== undefined) {
                $("#" + elementId).show();
            }
        }

        tryHideElement = (elementId: string) => {
            if (elementId !== undefined) {
                $("#" + elementId).hide();
            }
        }
	}
}