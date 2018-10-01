module Gartner {
	export interface ThreadedDiscussionSettingsOptions {
		subjectEnabled: boolean;
		criticalPeerReviewEnabled: boolean;
	}

	export class ThreadedDiscussionSettings {
		subjectEnabled: boolean;
		criticalPeerReviewEnabled: boolean;

		onReady(options) {
			this.subjectEnabled = options.subjectEnabled;
			this.criticalPeerReviewEnabled = options.criticalPeerReviewEnabled;
		}
	}
}