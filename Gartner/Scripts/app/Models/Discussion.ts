module Gartner {

	export class Discussion {
		public itemId: number;
		public level: number;

		public id: number;
		private entityId: number;
		private itemStatusId: number;

		public isReviewComplete = ko.observable<boolean>();

		public subjectEnabled: boolean;
		public criticalPeerReviewEnabled: boolean;

		public topmostParentId: number;
		private showEdit: boolean;
		private subject = ko.observable<string>();
		private commentDetail = ko.observable<string>();
		private createdBy = ko.observable<number>();
		private createdByName = ko.observable<string>();
		private updatedBy = ko.observable<number>();
		private updatedByName = ko.observable<string>();
		private formattedCreatedTime = ko.observable<string>();
		private formattedUpdatedTime = ko.observable<string>();
		private createdTime: Date;
		private updatedTime: Date;
		public children = ko.observableArray<Discussion>();

		private formattedGreenFlag: string;
		private formattedRedFlag: string;
		public savedRoles = ko.observable<string>("");
		public currentRoles = ko.observable<string>("");
		public discussionAttachments: DiscussionAttachments;


		//for editing
		private lastSubject: string;
		private lastCommentDetail: string;

		private showAllCommentDetail = ko.observable(false);
		private showAll = ko.observable(false);

		//used by flag component
		private greenFlagValue = ko.observable<string>("undefined");
		private redFlagValue = ko.observable<string>("undefined");
		private currentFlagModal = ko.observable<FlagType>();

		//used outside of class
		public parentId: number;
		public discussionFlags = ko.observableArray<IDiscussionFlagging>();
		public parentDiscussionFlags = ko.observableArray<IDiscussionFlagging>();

		//ko computed
		private longCommentDetail: any;
		private formattedCommentDetail: any;

		constructor(itemId: number, itemStatusId: number, level: number, roles: string, parentDiscussionFlags, response?: IDiscussion, parentId?: number) {
			this.id = 0;
			this.itemId = itemId;
			this.itemStatusId = itemStatusId;
			this.level = level;
			this.formattedGreenFlag = "";
			this.formattedRedFlag = "";
			this.parentId = parentId;
			this.discussionAttachments = new DiscussionAttachments(itemId);

			const settings = <ThreadedDiscussionSettings>Gartner.instanceOf("ThreadedDiscussionSettings");
			this.subjectEnabled = settings.subjectEnabled;
			this.criticalPeerReviewEnabled = settings.criticalPeerReviewEnabled;

			if (roles !== undefined && roles !== null) {
				this.currentRoles(roles);	
			}
			

			if (response !== undefined) {
				this.from(response);
			} else {
				this.entityId = itemId;
			}

			this.longCommentDetail = ko.computed(() => this.commentDetail() !== undefined && this.commentDetail().length > 100);
			this.formattedCommentDetail = ko.pureComputed(<KnockoutComputedDefine<string>>{
				read: () => {
					return this.commentDetail();
				},
				write: (value) => {
					this.commentDetail(StringUtilities.trimBlankLines(value));
				},
				owner: this
			});
			if (parentDiscussionFlags !== null) {
				this.parentDiscussionFlags = parentDiscussionFlags;
			}
			this.updateDiscussionFlags();
			
		}

		from(response: IDiscussion) {
			this.id = response.Id !== 0 ? response.Id : undefined;
			this.entityId = response.EntityId !== 0 ? response.EntityId : this.itemId;
			this.parentId = response.ParentId !== 0 ? response.ParentId : this.parentId;
			this.topmostParentId = response.TopmostParentId;
			this.subject(response.Subject);
			this.commentDetail(response.CommentDetail || undefined);
			this.createdBy(response.CreatedBy);
			this.createdByName(response.CreatedByName);
			this.updatedBy(response.UpdatedBy);
			this.updatedByName(response.UpdatedByName);
			this.formattedCreatedTime(response.FormattedCreatedTime);
			this.formattedUpdatedTime(response.FormattedUpdatedTime);
			this.createdTime = response.CreatedTime;
			this.updatedTime = response.UpdatedTime;
			this.showEdit = (Gartner.loggedInUserInformation.isAdmin || response.CreatedBy === Gartner.loggedInUserInformation.userId);

			if (response.Roles) {
				this.savedRoles(response.Roles);
			}
			if (response.Children) {
				this.children(response.Children.map(x => new Discussion(this.itemId, this.itemStatusId, this.level + 1, null, null, x)));
			}
			if (response.Flags) {
				this.discussionFlags(response.Flags);
				this.updateDiscussionFlags();
			}
			if (response.Files) {
				this.discussionAttachments.addSavedAttachment(response.Files);
			}
		}

		toggleDisplay() {
			var val = this.showAll() || false; // default to false
			this.showAll(!val);
		}

		updateDiscussionFlags() {
			var redFlagExistsInParent = false;
			ko.utils.arrayForEach(this.parentDiscussionFlags(), flag => {
				if (flag.FlagTypeId === FlagType.Red) {
					this.redFlagValue(flag.FlagValue.toString());
					redFlagExistsInParent = true;
				}
				if (flag.FlagTypeId === FlagType.Green && flag.DiscussionId !== this.id && flag.FlagValue) {
					this.greenFlagValue(flag.FlagValue.toString());
				}
			});
			if (!redFlagExistsInParent) {
				this.greenFlagValue("undefined");
			}
			ko.utils.arrayForEach(this.discussionFlags(), flag => {
				if (flag.FlagTypeId === FlagType.Green) {
					this.greenFlagValue(flag.FlagValue.toString());
					if (this.greenFlagValue() === "true")
						this.formattedGreenFlag = flag.FormattedCreatedTime + " by " + flag.CreatedByName;
				} else if (flag.FlagTypeId === FlagType.Red) {
					this.redFlagValue(flag.FlagValue.toString());
					if (this.redFlagValue() === "true")
						this.formattedRedFlag = flag.FormattedCreatedTime + " by " + flag.CreatedByName;
				}
			});
		}

		toggleShowAllCommentDetail = () => {
			this.showAllCommentDetail(!this.showAllCommentDetail());
		}

		withParent(parentId: number) {
			this.parentId = parentId;
			return this;
		}

		addChild(discussion: Discussion) {
			this.children.push(discussion);
		}

		editing() {
			this.lastSubject = this.subject();
			this.lastCommentDetail = this.commentDetail();
		}

		replying() {
			this.lastSubject = this.subject();
			this.lastCommentDetail = this.commentDetail();
		}

		getDiscussionGroup = (): DiscussionGroup => {
			var viewModel = <ThreadedDiscussionViewModel>Gartner.instanceOf("ThreadedDiscussionViewModel");
			return viewModel.getDiscussionGroupByItemStatusId(this.itemStatusId);
		}

		reply() {
			this.getDiscussionGroup().replyDiscussion(this);
		}

		edit() {
			var group = this.getDiscussionGroup();
			group.editDiscussion(this);
		}

		revert() {
			this.subject(this.lastSubject);
			this.commentDetail(this.lastCommentDetail);
		}

		totalChildDiscussions(): number {
			if (this.children() !== undefined) {
				return this.children().reduce((acc: number, discussion: Discussion) => {
					return acc + 1 + discussion.totalChildDiscussions();
				}, 0);
			}

			return 0;
		}

		getFlagId(): number {
			var id = undefined;
			ko.utils.arrayForEach(this.discussionFlags(), flag => {
				if (this.currentFlagModal() === FlagType.Red && flag.FlagTypeId === FlagType.Red) {
					id = flag.Id;
				}
				else if (this.currentFlagModal() === FlagType.Green && flag.FlagTypeId === FlagType.Green) {
					id = flag.Id;
				}
			});
			return id;
		}

		toJson(attachments: Array<IDiscussionFile> = []): IDiscussion {
			var flag;

			var id = this.getFlagId();

			if (this.currentFlagModal() === FlagType.Red
				&& this.redFlagValue() !== "undefined") {
				flag = {
					FlagTypeId: FlagType.Red,
					FlagValue: this.redFlagValue() === "true",
					Id: id
				};

			}
			else if (this.currentFlagModal() === FlagType.Green
				&& this.greenFlagValue() !== "undefined") {
				flag = {
					FlagTypeId: FlagType.Green,
					FlagValue: this.greenFlagValue() === "true",
					Id: id
				};
			}

			return <IDiscussion>{
				Id: this.id,
				EntityId: this.entityId,
				ItemStatusId: this.itemStatusId,
				ParentId: this.parentId,
				TopmostParentId: this.topmostParentId,
				Subject: this.subject(),
				CommentDetail: this.commentDetail(),
				CreatedBy: this.createdBy(),
				Children: this.children() !== undefined ? this.children().map(x => x.toJson()) : undefined,
				CreatedTime: this.createdTime,
				UpdatedTime: this.updatedTime,
				UpdatedBy: this.updatedBy(),
				FormattedCreatedTime: this.formattedCreatedTime(),
				FormattedUpdatedTime: this.formattedUpdatedTime(),
				CreatedByName: this.createdByName(),
				UpdatedByName: this.updatedByName(),
				Flags: (flag !== undefined ? [flag] : undefined),
				Roles: this.currentRoles(),
				Files: attachments,
				IsReviewComplete: this.isReviewComplete()
			};
		}
	}
} 