/// <reference path="../../typings/moment/moment.d.ts" />
module Gartner {

	export interface SaveCallback {
		 (discussion: IDiscussion): void
	}

	export interface IDiscussionModalContext {
		action: Action;
		itemStatusId: number;
		onSave?: SaveCallback;
		onCancel?: () => void;
		discussion?: Discussion;
		replyParentDiscussion?: Discussion;
		parentDiscussion?: Discussion;
	}

	export class DiscussionModal {
		private itemId: number;
		private userFullName: string;
		private userEmployeeId: number;
		//private currentDateTime: string;
		private title = ko.observable<string>();
		private action = ko.observable<Action>();
		private discussion = ko.observable<Discussion>();
		private replyParentDiscussion = ko.observable<Discussion>();
		private isSaving = ko.observable<boolean>(false);
		private onSave: SaveCallback;
		private onCancel: () => void;
		private currentDateTime = ko.observable<string>();
		private allowedToMarkRedflag: boolean;
		private allowedToMarkGreenflag: boolean;
		private allowedToUploadFile: boolean;
		private isEditing: any;
		private isCreating: any;
		private isReplying: any;
		public flags = ko.observableArray<IDiscussionFlagging>();
		public currentUserRoles = ko.observable<string>();

		constructor(itemId: number, userFullName: string, userEmployeeId: number, currentDateTime: string, currentUserRoles, allowedToUploadFile: boolean) {
			this.itemId = itemId;
			this.userFullName = userFullName;
			this.userEmployeeId = userEmployeeId;
			//this.currentDateTime = currentDateTime;
			this.currentUserRoles = currentUserRoles;
			this.allowedToUploadFile = allowedToUploadFile;
			this.trackCurrentTime();

			this.isCreating = ko.computed(() => this.action() === Action.Create);
			this.isEditing = ko.computed(() => this.action() === Action.Edit);
			this.isReplying = ko.computed(() => this.action() === Action.Reply);
		}

		trackCurrentTime() {
			this.currentDateTime(this.getNow());
			setTimeout(() => {
				this.currentDateTime(this.getNow());
			}, 60000);
		}

		setContext = (context: IDiscussionModalContext) => {
			this.action(context.action);
			this.onSave = context.onSave;
			this.onCancel = context.onCancel;

			switch (this.action()) {
				case Action.Create:
					this.allowedToMarkRedflag = true;
					this.allowedToMarkGreenflag = false;
					this.title("Add Comment");
					this.discussion(new Discussion(this.itemId, context.itemStatusId, 0, this.currentUserRoles(), null));
					break;
				case Action.Edit:
					this.title("Edit Comment");
					context.discussion.currentRoles(this.currentUserRoles());
					this.discussion(context.discussion);
					break;
				case Action.Reply:
					this.title("Reply Comment");
					var redFlagExists = false;
					this.flags = context.replyParentDiscussion.discussionFlags;
					if (this.flags().length > 0 ) {
						ko.utils.arrayForEach(this.flags(), flag => {
							if (flag.FlagTypeId === FlagType.Red) {
								redFlagExists = true;
							}
						});
					}
					if (redFlagExists) {
						this.discussion(
							new Discussion(this.itemId, context.itemStatusId, context.replyParentDiscussion.level + 1, this.currentUserRoles(), context.replyParentDiscussion.discussionFlags)
							.withParent(context.replyParentDiscussion.id)
						);
					} else {
						this.discussion(
							new Discussion(this.itemId, context.itemStatusId, context.replyParentDiscussion.level + 1, this.currentUserRoles(), null)
								.withParent(context.replyParentDiscussion.id)
						);
					}

					
					this.replyParentDiscussion(context.replyParentDiscussion);
					break;
			}
		}

		cancel = () => {
			if (this.onCancel !== undefined) {
				this.onCancel();
			}
		}

		save = () => {
			this.isSaving(true);
			// hopefully we can remove loading after saving.
			DiscussionService.saveDiscussion(this.discussion())
				.done((response) => {
					if (response["exceptionMessage"]) {
						ErrorUtilities.showErrorFromResponse(response);
						return;
					}

					UpdateHelper.updateAjaxPanels(['Reviewers']);

					if (this.onSave !== undefined) {
						this.onSave(response);
					}
					this.clearModal();
				})
				.always(() => {
					this.isSaving(false);
				});
		}

		clearModal = () => {
			this.action(undefined);
			this.discussion(undefined);
			this.replyParentDiscussion(undefined);
			this.title(undefined);
			this.flags(undefined);
			this.onSave = undefined;
			this.onCancel = undefined;
		}

		getNow = () => {
			return moment(new Date()).utcOffset(-4).format("DD MMM YYYY hh:mm A");
		}
	}

} 