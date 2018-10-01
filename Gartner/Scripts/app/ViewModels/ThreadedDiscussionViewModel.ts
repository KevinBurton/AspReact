module Gartner {

	export interface ThreadedDiscussionOptions {
		itemId: number;
		itemStatusId: number;
		userFullName: string;
		userEmployeeId: number;
		currentDateTime: string;
		allowedToUploadFile: boolean;
		threadedDiscussionSubjectEnabled: boolean;
		threadedDiscussionCriticalPeerReviewEnabled: boolean;
	}

	export class ThreadedDiscussionViewModel {
		itemId: number;
		public allowedToUploadFile: boolean;
		private itemStatusId: number;
		private currentDiscussionGroup = ko.observable<DiscussionGroup>();
		public discussionGroups = ko.observableArray<DiscussionGroup>();
		discussionModal: DiscussionModal;
		currentUserRoles = ko.observable<string>();
		// knockout computed
		private totalDiscussions: any;

		onReady(options: ThreadedDiscussionOptions) {
			this.itemId = options.itemId;
			this.itemStatusId = options.itemStatusId;
			this.allowedToUploadFile = options.allowedToUploadFile;

			Gartner.createObject("ThreadedDiscussionSettings", <ThreadedDiscussionSettingsOptions>{
				storeInstance: true,
				subjectEnabled: options.threadedDiscussionSubjectEnabled,
				criticalPeerReviewEnabled: options.threadedDiscussionCriticalPeerReviewEnabled
			});
		   
			//todo: these should be passed in later, once we have workflow
			this.discussionGroups([
				new DiscussionGroup(this, 0, "Total Comments")
				//new DiscussionGroup(this, 1, "Idea"),
				//new DiscussionGroup(this, 2, "Pending Initial Approval"),
				//new DiscussionGroup(this, 3, "Pending Final Approval"),
				//new DiscussionGroup(this, 4, "Personal Draft"),
				//new DiscussionGroup(this, 5, "Title and Description Editing"),
				//new DiscussionGroup(this, 6, "Editor Assignment"),
				//new DiscussionGroup(this, 7, "First Management Review"),
				//new DiscussionGroup(this, 8, "Peer Review"),
				//new DiscussionGroup(this, 9, "Complete"),
				//new DiscussionGroup(this, 10, "External Review"),
				//new DiscussionGroup(this, 11, "Final Management Review"),
				//new DiscussionGroup(this, 12, "Presentation Templating"),
				//new DiscussionGroup(this, 13, "Editor Review"),
				//new DiscussionGroup(this, 14, "Analyst Review"),
				//new DiscussionGroup(this, 15, "Final Edit"),
				//new DiscussionGroup(this, 16, "Graphic Assignment"),
				//new DiscussionGroup(this, 17, "Graphic Review"),
				//new DiscussionGroup(this, 18, "Analyst Graphic Review"),
				//new DiscussionGroup(this, 19, "Final Graphic Review"),
				//new DiscussionGroup(this, 20, "Prep for Translation"),
				//new DiscussionGroup(this, 21, "Translation"),
				//new DiscussionGroup(this, 22, "Translation Review"),
				//new DiscussionGroup(this, 23, "Translation Final Edit"),
				//new DiscussionGroup(this, 24, "Waiting for Source Presentation")
			]);
			DiscussionService.getUserRoles(this.itemId)
				.done((role) => {
					if (role !== undefined) {
						this.currentUserRoles(role);
					} else {
						this.currentUserRoles(undefined);
					}
				});
			this.discussionModal = new DiscussionModal(options.itemId, options.userFullName, options.userEmployeeId, options.currentDateTime, this.currentUserRoles, this.allowedToUploadFile);
			this.expandCurrentDiscussionGroup();
			this.totalDiscussions = ko.computed<number>(() => this.getTotalDiscussions(this.discussionGroups()));

			EventUtilities.addHandlerToBody("click", "#commentsTab", this.loadAll);
			this.loadAll();
			
			ko.applyBindings(this, document.getElementById("discussion-thread"));
			ko.applyBindings(this, document.getElementById("addCommentModal"));
		}

		expandCurrentDiscussionGroup() {
				this.getCurrentDiscussionGroup().expandSection();
		}

		getCurrentDiscussionGroup() {
			return this.getDiscussionGroupByItemStatusId(this.itemStatusId);
		}

		loadAll = () => {
			this.getCurrentDiscussionGroup()
				.load()
				.done(() => {
					this.discussionGroups()
						.filter(group => group.itemStatusId !== this.itemStatusId)
						.forEach(group => group.load());
				});
			DiscussionService.canUploadFile(this.itemId)
				.done((uploadFile) => {
					this.allowedToUploadFile = uploadFile;
				});

			// Load "For Presentation" section.
			// TODO: Move this later when threaded discussions uses React.
			(window as any).store.dispatch({ type: 'DISCUSSIONS_LOADED' });
		}

		getTotalDiscussions = (discussionGroups: Array<DiscussionGroup>): number => {
			if (discussionGroups !== undefined) {
				return <number>discussionGroups.reduce((acc: number, discussionGroup: DiscussionGroup) => {
					return acc + discussionGroup.totalComments();
				}, 0);
			} else {
				return 0;
			}
		}

		toggleDiscussionGroup = (discussionGroup: DiscussionGroup) => {
			discussionGroup.collapsed(!discussionGroup.collapsed());

			return true;
		}

		getDiscussionGroupByItemStatusId = (itemStatusId: number) => {
			return this.discussionGroups().filter(x => x.itemStatusId === itemStatusId)[0];
		}
		
	}

} 