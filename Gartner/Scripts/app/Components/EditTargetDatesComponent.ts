module Gartner {
	interface Params {
		itemId: number;
		sectionsToUpdateOnSave: string[];
		modalShown: KnockoutObservable<boolean>;
	}

	ko.components.register("edit-target-dates", {
		viewModel: {
			createViewModel(params: Params) {
				return new TargetDateViewModel(params.itemId, params.sectionsToUpdateOnSave, params.modalShown);
			}
		},
		template: { fromUrl: "EditTargetDatesComponent.html", maxCacheAge: 1234 }
	});

}   