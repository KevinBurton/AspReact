module Gartner {
	interface Params {
		itemId: number;
		modalShown: KnockoutObservable<boolean>;
		sectionsToUpdateOnSave: Array<string>;
	}

	ko.components.register("edit-item-agendas", {
		viewModel: {
			createViewModel(params: Params) {
				return new AgendasViewModel(params.itemId, params.modalShown, params.sectionsToUpdateOnSave);
			}
		},
		template: { fromUrl: "EditItemAgendasComponent.html", maxCacheAge: 1234 }
	});

}  