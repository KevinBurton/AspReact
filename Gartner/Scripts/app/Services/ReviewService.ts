module Gartner.ReviewService {

	export function getBackupReviewsToDo(): JQueryPromise<any> {
		return ServiceUtilities.get<any>("/api/Reviews/BackupReviewsToDo");
	}
}