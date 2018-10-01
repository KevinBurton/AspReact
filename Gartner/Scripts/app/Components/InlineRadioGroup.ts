module Gartner {
	export interface RadioItem {
		text: KnockoutObservable<string>;
		selected: KnockoutObservable<boolean>;
	}

	export interface InlineRadioGroupParams {
		items: KnockoutObservableArray<RadioItem>;
	}

	class InlineRadioGroupViewModel {
		private items = ko.observableArray<RadioItem>();

		constructor(params: InlineRadioGroupParams) {
			this.items = params.items;
		}

		select = (item: RadioItem) => {
			this.items().forEach(x => x.selected(false));
			item.selected(true);
		}
	}

	ko["components"].register("inlineradiogroup", {
		viewModel: {
			createViewModel: (params: InlineRadioGroupParams) => {
				return new InlineRadioGroupViewModel(params);
			}
		},
		template: { fromUrl: "InlineRadioGroup.html", maxCacheAge: 1234 }
	});
}  