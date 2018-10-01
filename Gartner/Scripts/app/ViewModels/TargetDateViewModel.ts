module Gartner {
    export class TargetDateViewModel {
        private itemId: number;
        private sectionsToUpdateOnSave: Array<string>;

        private titleElementId = "targetdatetopublish";
        private isLoading = ko.observable<boolean>(false);
        private isSaving = ko.observable<boolean>(false);
        private savedData: IDocumentSubDetail;
        private targetDateToPublish = ko.observable<string>();
        private currTime = ko.observable<number>();		
		private canSave: any;
	

        constructor(itemId: number, sectionsToUpdateOnSave: string[], modalShown: KnockoutObservable<boolean>) {
            this.itemId = itemId;
            this.sectionsToUpdateOnSave = sectionsToUpdateOnSave;
            this.targetDateToPublish("");

            this.currTime(Date.now());

            this.canSave = ko.computed(() => {
                var isLoading = this.isLoading();
                var isSaving = this.isSaving();
                var selectedDate = Date.parse(this.targetDateToPublish());

                return !isLoading && !isSaving && (selectedDate > this.currTime());
            });

            modalShown.subscribe((isShown) => {
                if (isShown) {
                    this.getDocumentSubDetail();
                } else {
                    this.clearDocumentDetails();
                }
            });
        }

        getDocumentSubDetail = () => {
            this.isLoading(true);
			DocumentTargetDatesService.getDocumentSubDetailByItemId(this.itemId)
                .done(this.onGetDocumentSubDetail)
                .always(() => this.isLoading(false));
        }

        onGetDocumentSubDetail = (response: IDocumentSubDetail) => {
            if (!response) return;
            if (response.FormattedTargetDateToPublish) {
                this.targetDateToPublish(response.FormattedTargetDateToPublish);
            }
            this.savedData = response;
        }

        clearDocumentDetails = () => {
            this.isSaving(false);
        }

		toJSON(): IDocumentTargetDates {
            var toSave = this.targetDateToPublish();

            return {
                ItemId: this.itemId,
                TargetDateToPublish: toSave,
                FormattedTargetDateToPublish: toSave
            };
        }

        save = () => {
            //this.savedData.TargetDatetoPublish = this.targetDateToPublish();
            var json = JSON.stringify(this.toJSON());
            if (this.targetDateToPublish()) {
                this.isSaving(true);

				DocumentTargetDatesService.save(json)
                    .done(response => {
                        if (response.exceptionMessage) {
                            ErrorUtilities.showErrorFromResponse(response);
                            return;
                        }

                        toastr.success("Target Dates Saved");
                        UpdateHelper.updateAjaxPanels(this.sectionsToUpdateOnSave);
                    })
                    .always(() => {
                        setTimeout(() => {
                            this.isSaving(false);
                        }, 200);
                    });
            }
        }
    }
} 