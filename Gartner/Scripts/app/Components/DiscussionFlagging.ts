module Gartner {
	ko.components.register("flagcomponent", {
		viewModel: {
			createViewModel: function(params, componentInfo) {
				return new FlaggingViewModel(params.modalSelector, params.currentDiscussionId, params.parentDiscussionId,
												params.itemId, params.action, params.redFlag,
												params.greenFlag,
												params.currentFlagModal, params.discussionFlags,
												params.parentDiscussionFlags, params.currentUserRoles, params.isReviewComplete);
			}
		} ,
		template: { fromUrl: 'DiscussionFlagging.html', maxCacheAge: 1234 }
	});
	
} 