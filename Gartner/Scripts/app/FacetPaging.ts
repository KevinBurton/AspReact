/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />

module Gartner {

	export class FacetPaging {

		private pageSize = 4;
		private totalItems: number;
		private totalPages = ko.observable(0); 
		private currentPageIndex = ko.observable(0);
		
		onReady(json: {containerId: string}) {
			var container = $("#" + json.containerId);
			this.totalItems = container.find("li").length;
			this.totalPages(Math.ceil(this.totalItems / this.pageSize));

			ko.applyBindings(this, container[0]);
		}		

		goToNextPage = () => {
			if (!this.isLastPage()) {
				this.currentPageIndex(this.currentPageIndex() + 1);
			}
		}

		goToPreviousPage = () => {
			if (!this.isFirstPage()) {
				this.currentPageIndex(this.currentPageIndex() - 1);
			}
		}

		goToFirstPage = () => {
			this.currentPageIndex(0);
		}

		goToLastPage = () => {
			this.currentPageIndex(this.totalPages() - 1);
		}

		isItemVisible = (itemIndex: number) => {
			var startIndex = this.currentPageIndex() * this.pageSize,
				endIndex = startIndex + this.pageSize;

			return itemIndex >= startIndex && itemIndex < endIndex;
		}

		isFirstPage = ko.computed(() => {
			return this.currentPageIndex() === 0;
		}, this);

		isLastPage = ko.computed(() => {
			return this.currentPageIndex() === (this.totalPages() - 1);
		}, this);

		currentPageOfTotal = ko.computed(() => {
			var currentPage = this.currentPageIndex() + 1;
			return currentPage + " of " + this.totalPages();
		}, this);

	}	

} 