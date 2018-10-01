module Gartner {
	export interface CheckboxParams {
		text: KnockoutObservable<string>;
		checked: KnockoutObservable<boolean>;
	}

	class CheckboxViewModel {
		private text: KnockoutObservable<string>;
		private checked: KnockoutObservable<boolean>;

		constructor(params: CheckboxParams) {
			this.text = params.text;
			this.checked = params.checked;
		}

		toggle = () => {
			this.checked(!this.checked());
		}
	}

	ko["components"].register("checkbox", {
		viewModel: {
			createViewModel: (params: CheckboxParams) => {
				return new CheckboxViewModel(params);
			}
		},
		template: { fromUrl: "Checkbox.html", maxCacheAge: 1234 }
	});
}   