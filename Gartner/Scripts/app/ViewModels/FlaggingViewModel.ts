module Gartner {

	export class FlaggingViewModel {

		private modalSelector: string;
		private currentDiscussionId: number;
		private parentDiscussionId: number;
		private itemId: number;

		// ko observables
		private parentRedFlag = ko.observable<string>("false");
		private parentGreenFlag = ko.observable<string>("false");
		private discussionFlags = ko.observableArray<IDiscussionFlagging>();
		private parentDiscussionFlags = ko.observableArray<IDiscussionFlagging>();
		private currentFlagModal = ko.observable<FlagType>(FlagType.Red);
		private action = ko.observable<Action>();
		private currentUserRoles = ko.observable<string>();

		private commentResolved = ko.observable<boolean>(false);
		private commentResolvedEnabled = ko.observable<boolean>(false);
		private commentResolvedText = ko.observable<string>();
		private commentResolvedVisible = ko.observable<boolean>(false);
		private needAuthorAttention = ko.observable<boolean>(false);
		private needAuthorAttentionText = ko.observable<string>();
		private needAuthorAttentionVisible = ko.observable<boolean>(false);
		private userReviewCompleted = ko.observable<boolean>(false);
		private userReviewText = ko.observable<string>();
		private userReviewOptionVisible = ko.observable<boolean>(false);
		private isReviewComplete = ko.observable<boolean>(false);

		// ko computed
		private canFlagAsResolved: any;
		private canFlagForAttention: any;

		constructor (
			modalSelector: string,
			currentDiscussionId: number,
			parentDiscussionId: number,
			itemId: number,
			action: KnockoutObservable<Action>,
			redFlag: KnockoutObservable<string>,
			greenFlag: KnockoutObservable<string>,
			currentFlagModal: KnockoutObservable<FlagType>,
			discussionFlags: KnockoutObservableArray<IDiscussionFlagging>,
			parentDiscussionFlags: KnockoutObservableArray<IDiscussionFlagging>,
			currentUserRoles: KnockoutObservable<string>,
			isReviewComplete: KnockoutObservable<boolean>
		)
		{
			this.modalSelector = modalSelector;
			this.parentRedFlag = redFlag;
			this.parentGreenFlag = greenFlag;
			this.action = action;
			this.currentDiscussionId = currentDiscussionId;
			this.parentDiscussionId = parentDiscussionId;
			this.itemId = itemId;
			this.discussionFlags = discussionFlags;
			this.parentDiscussionFlags = parentDiscussionFlags;
			this.currentFlagModal = currentFlagModal;
			this.currentUserRoles = currentUserRoles;
			this.userReviewCompleted = isReviewComplete;

			this.checkReviewCompleted();
			this.checkCanFlagAsResolved();
			this.setupComputed();
			this.setupObservables();

			// subscribe events
			this.commentResolved.subscribe(this.onCommentResolvedChange);
			this.needAuthorAttention.subscribe(this.onNeedAuthorAttentionChange);
			this.userReviewCompleted.subscribe(this.onReviewCompleteChange);
		}

		setupComputed = () => {
			this.canFlagAsResolved = ko.pureComputed(() => {
				return this.commentResolvedEnabled()
					&& this.action() === Action.Reply
					&& (this.currentUserRoles().indexOf("Primary Author") > -1 || this.currentUserRoles().indexOf("Co-Author") > -1);
			}, this);

			this.canFlagForAttention = ko.pureComputed(() => {
				return this.currentUserRoles().indexOf("Primary Author") === -1
					&& this.currentUserRoles().indexOf("Co-Author") === -1;
			}, this);
		}

		setupObservables = () => {
			if (this.canFlagAsResolved()) {
				this.commentResolvedText("Mark as Resolved");
				this.commentResolvedVisible(true);
			} else if (this.canFlagForAttention()) {
				this.needAuthorAttentionText("Need Author's Attention");
				this.needAuthorAttentionVisible(true);
			}

			if (this.currentUserRoles()) {
				if (this.currentUserRoles().indexOf("Peer Reviewer") !== -1) {
					this.userReviewText("Done with my Review");
					this.userReviewOptionVisible(true);
				} else if (this.currentUserRoles().indexOf("Mandatory Reviewer") !== -1) {
					this.userReviewText("Mandatory Review Approval");
					this.userReviewOptionVisible(true);
				}
			}
		}

		checkCanFlagAsResolved = () => {
			if (!this.parentDiscussionFlags()) {
				return;
			}

			const flagsToCheck = this.parentDiscussionFlags().concat(this.discussionFlags());
			let commentAlreadyResolved = false;
			let parentRedFlagExists = false;
			ko.utils.arrayForEach(flagsToCheck, flag => {
				if (flag.FlagValue && flag.FlagTypeId === FlagType.Red && flag.DiscussionId === this.parentDiscussionId) {
					parentRedFlagExists = true;
				} else if (flag.FlagValue && flag.FlagTypeId === FlagType.Green && flag.DiscussionId !== this.currentDiscussionId) {
					commentAlreadyResolved = true;
				}
			});
			if (!parentRedFlagExists || commentAlreadyResolved) {
				return;
			}

			DiscussionFlagService.checkGreenFlagEditable(this.itemId, this.currentDiscussionId)
				.done((canFlagAsResolved: boolean) => {
					if (canFlagAsResolved) {
						this.commentResolvedEnabled(true);
						this.currentFlagModal(FlagType.Green);
					}
				});
		}

		checkReviewCompleted = () => {
			DiscussionFlagService.getReviewStatus(this.itemId, Gartner.loggedInUserInformation.userId)
				.done((reviewDone: boolean) => {
					this.userReviewCompleted(reviewDone);
				});
		}

		onReviewCompleteChange = (reviewDone) => {
			this.isReviewComplete(reviewDone);
		}

		onCommentResolvedChange = (isResolved) => {
			if (this.canFlagAsResolved() && isResolved) {
				this.parentGreenFlag("true");
				this.currentFlagModal(FlagType.Green);
			} else if (this.canFlagAsResolved() && !isResolved) {
				this.parentGreenFlag("false");
			}
		}

		onNeedAuthorAttentionChange = (needsAttention) => {
			if (this.canFlagForAttention() && needsAttention) {
				this.parentRedFlag("true");
				this.currentFlagModal(FlagType.Red);
			} else if (this.canFlagForAttention() && !needsAttention) {
				this.parentRedFlag("false");
			}
		}

		onReady() {
			ko.applyBindings(this, document.getElementById(this.modalSelector));
		}
	}
}