module Gartner {
	interface Params {
		itemId: number;
		sectionsToUpdateOnSave: string[];
		modalShown: KnockoutObservable<boolean>;
	}

	ko.components.register("edit-content-types", {
		viewModel: {
			createViewModel: function (params, componentInfo) {
				var vm = new ContentTypeViewModel(params.itemId, params.sectionsToUpdateOnSave, params.modalShown);
				$(componentInfo.element).on('reloadContentTypeInformation', () => {
					vm.reloadContentTypeInformation();
				});
				return vm;
			}
		},
		template: { fromUrl: 'EditContentTypesComponent.html', maxCacheAge: 1234 }
	});
}   