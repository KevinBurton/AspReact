/// <reference path="../utilities/eventutilities.ts" />
/// <reference path="../utilities/errorutilities.ts" />
/// <reference path="../interfaces/idocumentinformation.ts" />

module Gartner {
	export enum AuthorOrderChange {
		Up = 1,
		Down = -1
	}

	export class DocumentInformationViewModel {
		private itemId: number;
		private modalSelector: string;
		private sectionsToUpdateOnSave: Array<string>;
		private titleElementId = "title";
		private descriptionElementId = "description";
		private authorInputId = "add-author";

		private isLoading = ko.observable<boolean>(false);
		private title = ko.observable<string>();
		private description = ko.observable<string>();
		private isSaving = ko.observable<boolean>(false);
		public selectedAuthors = ko.observableArray<Models.Author>();
		public selectedAuthor = ko.observable();
		private canAddAuthor = ko.observable<boolean>(false);

		private savedData: IDocumentInformation;
		private authorToAdd: Models.Author;

		

		//ko computed
		private canSave: any;
		private authorLength: any;

		onReady(json: { itemId: number; sectionsToUpdateOnSave: Array<string> }) {
			this.modalSelector = "#documentdetail-modal";
			this.itemId = json.itemId;
			this.sectionsToUpdateOnSave = json.sectionsToUpdateOnSave;

			this.restrictTextFields();

			this.canSave = ko.computed(() => {
				var isLoading = this.isLoading();
				var isSaving = this.isSaving();
				return !isLoading && !isSaving;
			});

			this.authorLength = ko.computed(() => {
				return this.selectedAuthors().filter((aut: Models.Author) => {
					return !aut["_destroy"];
				}).length;
			});
			this.clearAuthorInformation();

			EventUtilities.addHandlerToBody("click", "#editDocumentInformation", this.showModal);

			this.getDocumentInformation();

			this.selectedAuthor.subscribe(this.onSelectAuthor);

			ko.applyBindings(this, $(this.modalSelector)[0]);
		}

		showModal = (event?: JQueryEventObject, loaded: boolean = false) => {
			if (event) {
				event.preventDefault();
			}

			if (!loaded) {
				this.clearDocumentInformation();
				this.getDocumentInformation();
			}
			if (loaded) {
                $(this.modalSelector).modal(<any>{ backdrop: 'static', keyboard: false });
			}
			$(this.modalSelector).modal("show");
			$("#" + this.titleElementId).focus();
		}

		restrictTextFields() {
			MaxLengthUtility.add(this.titleElementId, true, 90, 255);
			MaxLengthUtility.add(this.descriptionElementId, true, 400, 2000);
		}

		save = () => {
			var json = JSON.stringify(this.toJSON());
			if (this.title() && this.description()) {
				this.isSaving(true);
				DocumentInformationService.save(json)
					.done(response => {
						if (response.exceptionMessage) {
							ErrorUtilities.showErrorFromResponse(response);
							return;
						}

						$(this.modalSelector).modal("hide");
						toastr.success("Document Information Saved");
						UpdateHelper.updateAjaxPanels(this.sectionsToUpdateOnSave);
					})
					.always(() => {
						setTimeout(() => {
							this.isSaving(false);
						}, 200);
					});
			} else {
				toastr.error("Documents require a Title and Description");
			}
		}

		toJSON = () => {
			var finalAuthorList = this.getFinalAuthorList();
			
			return {
					ItemId: this.itemId,
					Title: this.title(),
					Description: this.description(),
					Authors: finalAuthorList.map(author => author.toJSON())
				}
		}

		getFinalAuthorList = (): any => {
			var authors = this.selectedAuthors().filter((aut: Models.Author) => {
				return ((aut.ObjectState !== ObjectStateEnum.Unchanged) || (aut.Id !== 0));
			});
			return authors;
		}
		cancel = () => {
			if (!this.savedData.Title) {
				this.clearDocumentInformation();
				ErrorUtilities.clearErrors();
				this.showModal();
			} else {
				$(this.modalSelector).modal("hide");
			}
		}

		getDocumentInformation = () => {
			this.isLoading(true);
			DocumentInformationService.getDocumentInformationByItemId(this.itemId)
				.done(this.onGetDocumentInformation)
				.always(() => this.isLoading(false));
		}

		onGetDocumentInformation = (response: IDocumentInformation) => {
			if (!response) return;
			if (response.Title) {
				this.title(response.Title);
			}

			if (response.Description) {
				this.description(response.Description);
			}

			var authors = (response.Authors || []).map((authr) => {
				var author = new Models.Author(authr.Id, authr.EmployeeName, authr.EmployeeId, authr.AuthorType, authr.ObjectState, authr.AuthorOrder);
				author.AuthorOrderObservable.subscribe(this.sortedAuthors);
				return author;
			});

			this.selectedAuthors(authors);

			if (!this.title() && !this.description()) {
				this.showModal(undefined, true);
			}
			this.savedData = response;
		}

		onSelectAuthor = (newValue: any) => {
			if (!newValue) return;

			if (!newValue || isNaN(newValue)) return;
			var valueAsInt = parseInt(newValue, 10);
			
			var authorAlreadyExists = this.selectedAuthors().filter((s: Models.Author) => {
				return  (s.isAuthorWithEmployeeId(valueAsInt) && (!s["_destroy"]));
			}).length > 0;

			if (authorAlreadyExists) return;

			if (valueAsInt) {
				AuthorService.getEmployeeDetailByEmployeeId(valueAsInt)
					.done(response => {
						this.authorToAdd = new Models.Author(0, response, valueAsInt, (this.selectedAuthors().length > 0
							? AuthorType.CoAuthor : AuthorType.Primary),
							ObjectStateEnum.Added,
							this.authorLength() + 1);
						this.canAddAuthor(true);

					});
			} else {
				this.canAddAuthor(false);
			}
		}

		addAuthor = () => {
			if (this.canAddAuthor()) {

				var empId = this.authorToAdd.EmployeeId;

				var authorFromList = ko.utils.arrayFirst(this.selectedAuthors(), (auth: Models.Author) => (auth.EmployeeId === empId));
				var newAuthor;

				if (authorFromList === null || authorFromList === undefined) {
					newAuthor = this.authorToAdd;
					newAuthor.AuthorOrderObservable.subscribe(this.sortedAuthors);
					newAuthor.AuthorOrderObservable(newAuthor.AuthorOrder);
					this.selectedAuthors.push(this.authorToAdd);
				} else {
					var newState;
					if (authorFromList.ObjectState === ObjectStateEnum.Deleted && authorFromList.Id === 0) {
						newState = ObjectStateEnum.Added;
					} else {
						newState = ObjectStateEnum.Modified;
					}					
					newAuthor = new Models.Author(authorFromList.Id, authorFromList.EmployeeName,
						authorFromList.EmployeeId, authorFromList.AuthorType, newState, this.authorLength() + 1);
					newAuthor.AuthorOrderObservable.subscribe(this.sortedAuthors);
					newAuthor.AuthorOrderObservable(newAuthor.AuthorOrder);
					this.selectedAuthors.replace(authorFromList, newAuthor);
				}
				this.clearAuthorInformation();
			}
		}

		clearDocumentInformation = () => {
			this.title(this.savedData.Title);
			this.description(this.savedData.Description);
			this.clearAuthorInformation();
		}

		clearAuthorInformation = () => {
			this.canAddAuthor(false);
			this.selectedAuthor(undefined);
			this.authorToAdd = null;
			var comboBox = $("#" + this.authorInputId).data("kendoComboBox");
			if (comboBox) {
				comboBox.destroy();
			}
			this.initAuthorComboBox();
		}

		initAuthorComboBox() {
			$("#" + this.authorInputId).kendoComboBox(<any>{
				dataSource: DocumentInformationService.getAuthorsComboBoxDataSource(this.authorInputId),
				dataTextField: "DisplayText",
				delay: 400,
				filter: "contains",
				minLength: 1,
				autoBind: false,
				dataValueField: "EmployeeId",
				highlightFirst: true,
				value: this.selectedAuthor(),
				placeholder: "search employee by name..."
			});
		}

		setAuthorAsPrimary = (author: Models.Author) => {
			var index = this.selectedAuthors().indexOf(author);
			var priorAuthor;
			if (!author.IsPrimaryAuthor())
			{
				priorAuthor = this.selectedAuthors()[0];
				this.selectedAuthors()[0].IsPrimaryAuthor(false);
			}
			this.updateOrder(0, index);
			author.IsPrimaryAuthor(true);
			if (priorAuthor !== undefined) {
				priorAuthor.AuthorOrderObservable(2);
			}
		}

		removeAuthor = (author: Models.Author) => {
			var index = this.selectedAuthors().indexOf(author);
			author.AuthorOrder += 1000;
			author.ObjectState = ObjectStateEnum.Deleted;
			this.selectedAuthors.destroy(author);
			var totalAuthors = this.selectedAuthors().filter((aut: Models.Author) => {
					return !aut["_destroy"];
				}).length;			
			for (var indx = index; indx < totalAuthors; indx++) {
				this.selectedAuthors()[indx].AuthorOrderObservable(this.selectedAuthors()[indx].AuthorOrder - 1);
			} 
		}

		changeOrder = (author: Models.Author, change: AuthorOrderChange) => {
			//move up
			if (AuthorOrderChange.Up === change) {
				var priorAuthor = ko.utils.arrayFirst(this.selectedAuthors(), (auth: Models.Author) => (auth.AuthorOrder === author.AuthorOrder - 1));

				if (priorAuthor == null || author == null || priorAuthor.IsPrimaryAuthor()) {
					return;
				}
				var authorOrder = priorAuthor.AuthorOrder;
				priorAuthor.AuthorOrderObservable(author.AuthorOrder);
				author.AuthorOrderObservable(authorOrder);
				
			}
			//move down
			else if (AuthorOrderChange.Down == change) {
				var nextAuthor = ko.utils.arrayFirst(this.selectedAuthors(), (auth: Models.Author) => (auth.AuthorOrder === author.AuthorOrder + 1));

				if (nextAuthor == null || author == null || nextAuthor.IsPrimaryAuthor()) {
					return;
				}
				var authorOrder = author.AuthorOrder;
				author.AuthorOrderObservable(nextAuthor.AuthorOrder);
				nextAuthor.AuthorOrderObservable(authorOrder);
			}
		}

		changeOrderUp = (author: Models.Author) => { this.changeOrder(author, AuthorOrderChange.Up);}
		changeOrderDown = (author: Models.Author) => { this.changeOrder(author, AuthorOrderChange.Down);}

		sortedAuthors = () => {
			var authors = this.selectedAuthors().sort((a: Models.Author, b: Models.Author) => { return (a.AuthorOrder < b.AuthorOrder ? -1 : 1); });
			this.selectedAuthors(authors);
		}

		isMoveDownVisible = (author: Models.Author) => {
			var index = this.selectedAuthors().indexOf(author);
			var length= this.selectedAuthors().filter((aut: Models.Author) => {
				return !aut["_destroy"];
			}).length;
			return (author.AuthorOrder !== length);
		}

		isMoveUpVisible = (author: Models.Author) => {
			var index = this.selectedAuthors().indexOf(author);
			return (index !== 1 );
		}

		updateOrder = (index: number, endIndex: number) => {
			for (var indx = endIndex; indx >= 0; indx--) {
				
				this.selectedAuthors()[indx].AuthorOrderObservable(this.selectedAuthors()[indx].AuthorOrder + 1);
			} 
		}
	}

}