module Gartner {
	export class DiscussionGroup {
		private parent: ThreadedDiscussionViewModel;
		itemStatusId: number;
		private status: string;
		collapsed = ko.observable<boolean>(true);
		private discussions = ko.observableArray<Discussion>();
		private newDiscussion = ko.observable<Discussion>();
		private isLoading = ko.observable<boolean>(false);

		constructor(parent: ThreadedDiscussionViewModel, itemStatusId: number, statusName: string, discussions?: Array<Discussion>) {
			this.parent = parent;
			this.itemStatusId = itemStatusId;
			this.status = statusName;
			if (discussions !== undefined) {
				this.discussions(discussions);
			}
		}

		totalComments(): number {
			if (this.discussions() !== undefined) {
				return <number>this.discussions().reduce((acc: number, discussion: Discussion) => {
					return acc + 1 + discussion.totalChildDiscussions();
				}, 0);
			}

			return 0;
		}

		load = (): JQueryPromise<void> => {
			var promise = $.Deferred<void>();

			if (!this.isLoading()) {
				this.isLoading(true);
				DiscussionService.getDiscussionsByItemIdAndStatus(this.parent.itemId, this.itemStatusId)
					.done((discussions) => {
						if (discussions !== undefined) {
							this.discussions(discussions.map(x => this.toDiscussion(x, 0)));
						}
						promise.resolve();
					})
					.always(() => this.isLoading(false));
			} else {
				promise.resolve();
			}

			return promise;
		}

		expandSection() {
			setTimeout(() => {
				$("[href='#commentsCollapse_" + this.itemStatusId + "'] span").click();
			}, 500);
		}

		addDiscussion = () => {
			var context = {
				action: Action.Create,
				itemStatusId: this.itemStatusId,
				onSave: this.onSave(Action.Create)
			};

			this.setContextForModal(context);
		}

		editDiscussion = ( discussion: Discussion) => {
			discussion.editing();

			this.updateFlags(discussion);

			var context = {
				action: Action.Edit,
				itemStatusId: this.itemStatusId,
				onSave: this.onSave(Action.Edit, discussion),
				onCancel: () => this.onCancelEdit(discussion),
				discussion: discussion
			};
			this.setContextForModal(context);
		}

		updateFlags = (discussion: Discussion) => {
			if (discussion.parentId !== undefined || discussion.parentId !== null || discussion.parentId !== 0) {
				var discussionGroup = discussion.getDiscussionGroup();
				for (var i = 0; i < discussionGroup.discussions().length; i++) {
					var parentDiscussion = this.findParent(discussion, discussionGroup.discussions()[i]);
					if (parentDiscussion) {
						discussion.parentDiscussionFlags = parentDiscussion.discussionFlags;
						discussion.updateDiscussionFlags();
						break;
					}
				}
			}
			
		}
		replyDiscussion = (discussion: Discussion) => {
			discussion.replying();
			var context = {
				action: Action.Reply,
				itemStatusId: this.itemStatusId,
				onSave: this.onSave(Action.Reply, discussion),
				replyParentDiscussion: discussion
			};
			this.setContextForModal(context);
		}

		findParent = (discussion: Discussion, parentDiscussion): Discussion => {
			var returnValue;
			if (parentDiscussion.id === discussion.parentId) {
				returnValue = parentDiscussion;
			} else {
				if (parentDiscussion.children !== undefined) {
					for (var i = 0; i < parentDiscussion.children().length; i++) {
						returnValue = this.findParent(discussion, parentDiscussion.children()[i]);
						if (returnValue !== undefined)
							break;
					}
				}
			}
			return returnValue;
		}

		setContextForModal = (context: IDiscussionModalContext) => {
			this.parent.discussionModal.setContext(context);
			$("#addCommentModal").modal("show");
		}

		onSave = (action: Action, discussion?: Discussion) => {
			return (saved: IDiscussion) => {
				this.load();
				//todo: success message?
				$("#addCommentModal").modal("hide");
			};
		}

		onCancelEdit = (discussion: Discussion) => {
			discussion.revert();
		}

		toDiscussion = (discussion: IDiscussion, level: number) => {
			return new Discussion(this.parent.itemId, this.itemStatusId, level, discussion.Roles, null, discussion);
		}
	}
}