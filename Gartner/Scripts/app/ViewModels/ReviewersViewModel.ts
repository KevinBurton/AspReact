/// <reference path="../interfaces/IReviewer.ts" />
module Gartner {
	
	export class ReviewersViewModel {
		private modalSelector = "#reviewers-modal";
		private reviewerInputId = "add-reviewer-combo";
		private editButtonSelector = "#editReviewers";

		private itemId: number;
		private sectionsToUpdateOnSave: Array<string>;

		private isLoading = ko.observable<boolean>(false);
		private isSaving = ko.observable<boolean>(false);
		private selectedReviewer = ko.observable();
		private reviewerToAdd: Reviewer;
		private canAddReviewer = ko.observable<boolean>();

		private reviewers = ko.observableArray<Reviewer>();

		//ko computed
		private canSave: any;
		private orderedReviewers: any;

		onReady(json: { itemId: number; sectionsToUpdateOnSave: Array<string>; }) {
			this.itemId = json.itemId;
			this.sectionsToUpdateOnSave = json.sectionsToUpdateOnSave;

			this.orderedReviewers = ko.computed<Array<Reviewer>>(() => this.getOrderedReviewers(this.reviewers()));
			this.canSave = ko.computed<boolean>(() => this.getCanSave(this.isLoading(), this.isSaving()));

			EventUtilities.addHandlerToBody("click", this.editButtonSelector, this.showModal);

			this.selectedReviewer.subscribe(this.onSelectReviewer);

			ko.applyBindings(this, $(this.modalSelector)[0]);
		}

		getOrderedReviewers(reviewers: Array<Reviewer> = []): Array<Reviewer> {
			return reviewers.sort((a, b) => {
				if (a.ReviewerType > b.ReviewerType) return -1;
				if (a.ReviewerType < b.ReviewerType) return 1;

				if (a.EmployeeName > b.EmployeeName) return 1;
				if (a.EmployeeName < b.EmployeeName) return -1;

				return 0;
			});
		}

		getCanSave(isLoading: boolean, isSaving: boolean): boolean {
			return !isLoading && !isSaving;
		}

		showModal = (event: JQueryEventObject) => {
			event.preventDefault();

			this.clearReviewerCombo();
			setTimeout(() => this.getReviewers(), 1);
			$(this.modalSelector).modal("show");
		}

		clearReviewerCombo() {
			var comboBox = $("#add-reviewer-combo").data("kendoComboBox");
			if (comboBox) {
				comboBox.destroy();
			}

			$("#" + this.reviewerInputId).kendoComboBox(<any>{
				dataSource: ReviewersService.getReviewersComboBoxDataSource(this.itemId),
				dataTextField: "DisplayText",
				delay: 400,
				filter: "contains",
				minLength: 1,
				autoBind: false,
				dataValueField: "EmployeeId",
				highlightFirst: true,
				placeholder: "search employee by name..."
			});
		}

		getReviewers() {
			this.isLoading(true);
			ReviewersService.getReviewersByItemId(this.itemId)
				.done(reviewers => this.reviewers(reviewers.map(reviewer => new Reviewer(reviewer))))
				.always(() => this.isLoading(false));
		}

		onSelectReviewer = (employeeId: any) => {
			if (!employeeId) return;

			var reviewerEmployeeId = parseInt(employeeId, 10);
			if (isNaN(reviewerEmployeeId)) return;

			var reviewerAlreadyExists = this.reviewers()
				.filter(reviewer => reviewer.EmployeeId === reviewerEmployeeId && (!reviewer["_destroy"]))
				.length > 0;

			if (reviewerAlreadyExists) return;

			EmployeeService.getEmployeeFullNameByEmployeeId(reviewerEmployeeId)
				.done(reviewerName => {
					this.reviewerToAdd = new Reviewer({
						ReviewCompleted: false,
						EmployeeId: reviewerEmployeeId,
						EmployeeName: reviewerName
					}, ObjectStateEnum.Added);

					this.canAddReviewer(true);
				});
		}

		add = () => {
			if (this.canAddReviewer()) {
				var existingReviewer = this.reviewers().filter(reviewer =>
					reviewer.EmployeeId === this.reviewerToAdd.EmployeeId &&
					reviewer.ReviewerType === this.reviewerToAdd.ReviewerType)[0];

				if (existingReviewer !== undefined) {
					this.reviewers.replace(existingReviewer, this.reviewerToAdd);
				} else {
					this.reviewers.push(this.reviewerToAdd);	
				}

				this.canAddReviewer(false);
				this.reviewerToAdd = undefined;
				$("#" + this.reviewerInputId).data("kendoComboBox").text("");
				this.selectedReviewer(undefined);
			}
		}
			
		remove = (reviewer) => {
			if (reviewer.objectState === ObjectStateEnum.Added) {
				this.reviewers.remove(reviewer);
			} else {
				reviewer.objectState = ObjectStateEnum.Deleted;
				this.reviewers.destroy(reviewer);
			}
		}

		save = () => {
			var json = JSON.stringify(this.reviewers().map(reviewer => reviewer.toJson()));

			this.isSaving(true);
			ReviewersService.save(this.itemId, json)
				.done((response) => {
					if (response.exceptionMessage) {
						ErrorUtilities.showErrorFromResponse(response);
						return;
					}

					$(this.modalSelector).modal("hide");
					toastr.success("Reviewers Saved");
					this.reviewers(this.reviewers().filter(reviewer => !reviewer["_destory"]));
					UpdateHelper.updateAjaxPanels(this.sectionsToUpdateOnSave);
				})
				.always(() => this.isSaving(false));
		}

		cancel = () => {
			$(this.modalSelector).modal("hide");
		}

	}

}