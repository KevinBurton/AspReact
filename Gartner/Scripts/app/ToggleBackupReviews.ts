module Gartner {

	const backupFilter = { field: "ReviewerType", operator: "doesnotcontain", value: "Backup" };

	interface ToggleBackupReviewsOptions {
		gridName: string;
		toggleName: string;
	}

	export class ToggleBackupReviews {

		private firstClick: boolean;
		private gridDataSource: kendo.data.DataSource;
		private gridName: string;
		private toggleName: string;

		onReady = (json: ToggleBackupReviewsOptions) => {
			this.firstClick = true;
			this.gridName = json.gridName;
			this.toggleName = json.toggleName;

			var getGridInterval = setInterval(() => {
				const grid = $(`#${this.gridName}`).data("kendoGrid") as kendo.ui.Grid;
				if (grid !== undefined && grid != null) {
					this.gridDataSource = grid.dataSource;
					clearInterval(getGridInterval);
				}
			}, 100);

			$(`#${this.toggleName}`).change(this.toggleBackupReviewVisibility);
			$(`#${this.toggleName}`).prop("checked", false);
		};

		adjustTargetDateFormat = (backupReviewList) => {
			backupReviewList.forEach(backupReview => {
				if (backupReview.TargetDateToPeerReview) {
					const rowDate = moment(backupReview.TargetDateToPeerReview);
					backupReview.TargetDateToPeerReview = rowDate.format("DD MMM YYYY");
				}
			});
		};

		retrieveBackupReviews = () => {
			showLoadingIndicatorInGrid(this.gridName);
			ReviewService.getBackupReviewsToDo()
				.done(backupReviews => {
					this.adjustTargetDateFormat(backupReviews);
					this.gridDataSource.pushCreate(backupReviews);
				})
				.fail(() => {
					ErrorUtilities.showErrorMessage("Reviews To Do", "Failed to retrieve backup reviews for user.");
				})
				.always(() => {
					this.firstClick = false;
					showLoadingIndicatorInGrid(this.gridName, false);
				});
		};

		toggleBackupReviewVisibility = () => {
			if (this.firstClick) {
				this.retrieveBackupReviews();
			} else {
				this.toggleFilter();
			}
		};

		toggleFilter = () => {
			let currentFilters = getCurrentFilters(this.gridDataSource);
			if (currentFilters && currentFilters.length > 0) {
				const filterIndex = currentFilters.indexOf(backupFilter);
				if (filterIndex > -1) {
					currentFilters.splice(filterIndex, 1);
				} else {
					currentFilters.push(backupFilter);
				}
			} else {
				currentFilters = [backupFilter];
			}
			this.gridDataSource.filter(currentFilters);
		};
	}
}
