module Gartner {

	export class StatusDateItemControls {

		onReady() {
			var triggerSelector = ".list .list-item:not(.no-controls) .list-item-trigger";
			$("body").on("click", triggerSelector, this.triggerClick);
		}

		triggerClick = (event: JQueryEventObject) => {
			this.toggleControls(this.getListItemFromEvent(event));
		}

		getListItemFromEvent(event: JQueryEventObject) : JQuery {
			return $(event.target).parents(".list-item");
		}

		toggleControls(item: JQuery) {
			var content = item.find(".list-item-content");
			var controls = item.find(".list-item-controls");
			var trigger = item.find(".list-item-trigger");
			var isItemActive = item.hasClass("item-state-active");

			if (!trigger.length) {
				return false;
			}

			if (isItemActive) {
				content.animate({ left: "0%" }, 300, () => {
					content.removeAttr("style");
				});
				controls.animate({ right: "-63%" }, 300, () => {
					item.removeClass("item-state-active");
				});
			} else {
				if (controls.length) {
					content.animate({ left: "-63%" }, 300);
					controls.animate({ right: "0%" }, 300);

					item.addClass("item-state-active");
				}
			}
		}

	}
} 