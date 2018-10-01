module Gartner.DiscussionService {

	export function getDiscussionsByItemIdAndStatus(itemId: number, itemStatusId: number): JQueryPromise<Array<IDiscussion>> {
		return $.ajax({
			url: "/Discussion/DetailsByStatusId/" + itemId.toString(),
			data: { statusId: itemStatusId },
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function saveDiscussion(discussion: Discussion) : JQueryPromise<IDiscussion> {
		ErrorUtilities.clearErrors();

		const deferred = $.Deferred<IDiscussion>();

		saveAttachments(discussion)
			.done((attachments) => {
				// save actual discussion comment
				$.ajax(<JQueryAjaxSettings>{
					url: '/Discussion/Upsert',
					data: JSON.stringify(discussion.toJson(attachments)),
					type: 'POST',
					contentType: 'application/json',
					cache: false,
					error: () => ErrorUtilities.showGeneralError()
				})
				.done(discussion => deferred.resolve(discussion))
				.fail(() => deferred.reject());
			})
			.fail(() => deferred.reject());

		return deferred;
	}

	function saveAttachments(discussion: Discussion): JQueryPromise<Array<IDiscussionFile>> {
		const attachments = discussion.discussionAttachments.getAttachmentsNeedingUpload();
		if (attachments.length === 0) {
			return $.Deferred().resolve();
		}

		const data = new FormData();
		attachments.forEach((attachment, i) => {
			data.append(`file${i}`, attachments[i].file);
		});

		const fileUniqueId = (discussion.id >= 0) ? discussion.id : discussion.itemId;

		return ServiceUtilities.ajax<Array<IDiscussionFile>>({
			url: '/Discussion/UploadDiscussionFile?id=' + discussion.itemId + '&fileUniqueId=' + fileUniqueId,
			type: 'POST',
			data: data,
			contentType: false,
			cache: false,
			processData: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getUserRoles(itemId: number): JQueryPromise<string> {
		return $.ajax(<JQueryAjaxSettings>{
			url: "/Discussion/GetUserRoles/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
	export function canUploadFile(itemId: number): JQueryPromise<boolean> {
		return $.ajax({
			url: "/Document/CanUploadFile/" + itemId,
			cache: false,
			async : false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
}