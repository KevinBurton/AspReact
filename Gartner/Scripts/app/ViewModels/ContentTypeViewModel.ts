module Gartner {
	import ContentTypeView = Gartner.Models.ContentTypeView;

	interface KendoEvent {
		sender: {
			value: () => string;
			text: () => string;
		}
	}

	export class ContentTypeViewModel {
		private itemId: number;
		private sectionsToUpdateOnSave: Array<string>;

		//private titleElementId = "targetdatetopublish";
		private isLoading = ko.observable<boolean>(false);
		private isSaving = ko.observable<boolean>(false);
		private savedData: IContentType;
		private authoringLanguage = ko.observable<number>();

		private contentTypeDesc = ko.observable<string>("");
		private contentSubTypeDesc = ko.observable<string>("");
		private contentSubType = ko.observable<string>("");
		private contentTypeList = ko.observableArray<ContentTypeView>();
		private contentSubTypeList = ko.observableArray<ContentTypeView>();
		private selectedContentTypeId = ko.observable<number>();
		private selectedContentTypeName = ko.observable<string>();
		private selectedContentSubTypeId = ko.observable<number>();
		private selectedContentSubTypeName = ko.observable<string>();
		private contentComboBoxSelector = "#content-type-combo";
		private subContentComboBoxSelector = "#content-subtype-combo";
		private contentSelected = ko.observable<boolean>(false);
		private canSave: any;
		private contentDropDown: any;
		private subTypes: any;
		private dbContentTypeView : Models.ContentTypeView;
		private selectedContentTypeView : Models.ContentTypeView;


		constructor(itemId: number, sectionsToUpdateOnSave: string[], modalShown: KnockoutObservable<boolean>) {
			this.itemId = itemId;
			this.sectionsToUpdateOnSave = sectionsToUpdateOnSave;
			this.authoringLanguage(2); //AuthoringLanguageEnum.English.valueOf());
			this.selectedContentTypeName('');
			this.selectedContentSubTypeName('');

			DocumentContentTypesService.getContentTypeByItemId(this.itemId)
				.done((response) => {
					this.onGetContentType(response);
					this.load();
					this.clearContentCombo();
					this.clearSubContentCombo();
				})
				.always(() => this.isLoading(false));

			this.canSave = ko.computed(() => {
				var isLoading = this.isLoading();
				var isSaving = this.isSaving();

				return !isLoading && !isSaving;
			});

			this.subTypes = ko.computed(() => {
				var hold = this.contentTypeList()
					.filter(subtype => {
						if (subtype.ContentTypeId === this.selectedContentTypeId()) {
							return true;
						}
						return false;
					});
				return hold;
			});

			this.contentDropDown = ko.computed(() => {
				var hold = this.contentTypeList().filter(ServiceUtilities.distinctBy("ContentTypeId"));
				return hold;
			});

		}


		load = () => {
			this.isLoading(true);
			DocumentContentTypesService.getDocumentSubDetailByItemId(this.itemId)
				.done(content => {
					if (content.ContentTypeId != null && content.ContentTypeId !== 0) {
						$(this.contentComboBoxSelector).val(content.ContentTypeDesc);
						this.selectedContentTypeName(content.ContentTypeDesc);
						this.selectedContentTypeId(content.ContentTypeId);
					} else {
						(<any>$(this.contentComboBoxSelector).data("kendoComboBox")).clear();
					}
					if (content.AuthoringLanguage != null && content.AuthoringLanguage !== 0) {
						this.authoringLanguage(content.AuthoringLanguage);
					}
					if (content.ContentSubTypeId != null && content.ContentSubTypeId !== 0) {
						$(this.subContentComboBoxSelector).val(content.ContentSubTypeDesc);
						this.selectedContentSubTypeId(content.ContentSubTypeId);
						this.selectedContentSubTypeName(content.ContentSubTypeDesc);
					} else {
						(<any>$(this.subContentComboBoxSelector).data("kendoComboBox")).clear();
					}
				})
				.always(() => this.isLoading(false));
		}


		onGetContentType = (response: Array<IContentTypeView>) => {
			var contentTypes = (response || []).map((view) => {
				var contentType = new Models.ContentTypeView(view.ItemId,
					view.ContentTypeId,
					view.ContentTypeDesc,
					view.SubTypeId,
					view.SubTypeDesc);
				return contentType;
			});
			this.contentTypeList(contentTypes);
		}

		onGetDocumentSubDetail = (response: IContentType) => {
			if (!response) return;
			this.authoringLanguage(response.authoringLanguage);
			this.savedData = response;
		}

        clearDocumentDetails = () => {
			this.isSaving(false);
		}

		reloadContentTypeInformation = () => {
			this.selectedContentTypeId(undefined);
			this.selectedContentSubTypeId(undefined);
			this.authoringLanguage(undefined);
			this.selectedContentTypeName(undefined);
			this.selectedContentSubTypeName(undefined);
			DocumentContentTypesService.getContentTypeByItemId(this.itemId)
				.done((response) => {
					this.onGetContentType(response);
					this.load();
					this.clearContentCombo();
					this.clearSubContentCombo();
				})
				.always(() => this.isLoading(false));
			
		}
		
		toJSON(): IContentType {

			return {
				itemId: this.itemId,
				authoringLanguage: this.authoringLanguage(),
				contentTypeId: this.selectedContentTypeId(),
				contentSubTypeId: this.selectedContentSubTypeId()
			};
		}

		save = () => {
			var json = JSON.stringify(this.toJSON());
			if (this.authoringLanguage && this.selectedContentTypeId && this.selectedContentSubTypeId) {
				this.isSaving(true);

				DocumentContentTypesService.save(json)
					.done(response => {
						if (response.exceptionMessage) {
							ErrorUtilities.showErrorFromResponse(response);
							return;
						}

						toastr.success("Content Type Saved");
						this.isSaving(false);
						UpdateHelper.updateAjaxPanels(this.sectionsToUpdateOnSave);
					})
					.always(() => {
						setTimeout(() => {
							this.isSaving(false);
						}, 200);
					});
			}
		}

		clearContentCombo() {
			var comboBox = $(this.contentComboBoxSelector).data("kendoComboBox");
			if (comboBox) {
				comboBox.destroy();
			}

			$(this.contentComboBoxSelector).kendoComboBox(<any>{
					dataSource: this.contentDropDown(),
					dataTextField: "ContentTypeDesc",
					delay: 400,
					//filter: "contains",
					//minLength: 1,
					autoBind: false,
					dataValueField: "ContentTypeId",
					highlightFirst: true,
					placeholder: "Select Content Type...",
					change: (e: KendoEvent) => {
						this.setContentType(e.sender.value(), e.sender.text());
						//this.clearSubContentCombo();
					}
				});
		}

		onGetContentSubtypes = (response: Array<IContentTypeView>) => {
			var subContentTypes = (response || []).map((view) => {
				var subContentType = new Models.ContentTypeView(view.ItemId,
					view.ContentTypeId,
					view.ContentTypeDesc,
					view.SubTypeId,
					view.SubTypeDesc);
				return subContentType;
			});
			this.contentSubTypeList(subContentTypes);
			this.clearSubContentCombo();
		}

		clearSubContentCombo() {
			var comboBox = $(this.subContentComboBoxSelector).data("kendoComboBox");
			if (comboBox) {
				comboBox.destroy();
			}
			try {
				$(this.subContentComboBoxSelector).kendoComboBox(<any>{
				dataSource: this.subTypes(),
				dataTextField: "SubTypeDesc",
				delay: 400,
				cascadeFrom: "content-type-combo",
				//filter: "contains",
				//minLength: 1,
				autoBind: false,
				dataValueField: "SubTypeId",
				highlightFirst: true,
				placeholder: "Select Content Sub Type...",
				change: (e: KendoEvent) => {
					this.setContentSubType(e.sender.value(), e.sender.text());
				}
			});
			} catch (e) {

			} 
		
		}

		setContentType = (value: string, text: string) => {
			if (!value) return;

			this.selectedContentTypeId(Number(value));
			this.contentTypeDesc(text);
			this.selectedContentSubTypeId(undefined);
			this.selectedContentSubTypeName(undefined);
			this.clearSubContentCombo();
		}

		setContentSubType = (value: string, text: string) => {
			if (!value ) return;
			this.selectedContentSubTypeId(Number(value));
			this.contentSubTypeDesc(text);
		}
	}
	export enum
		AuthoringLanguageEnum {
		Chinese= 1,
		English= 2,
		Finnish= 3,
		German= 4,
		Japanese= 5,
		Portuguese= 6
	}

} 