module Gartner.DiscussionFlagService {
	export function checkGreenFlagEditable(itemId :number, discussionId: number): JQueryPromise<boolean> {
		return $.ajax({
			url: "/Discussion/CheckGreenFlagEditable/" + itemId.toString(),
			async: false,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getReviewStatus(itemId: number, reviewerId: number): JQueryPromise<boolean> {
		return $.ajax({
			url: "/Discussion/IsReviewCompleted?id=" + itemId.toString() + "&empId=" + reviewerId.toString(),
			async: false,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
} 