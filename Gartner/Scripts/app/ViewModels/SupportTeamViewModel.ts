module Gartner {
	export class SupportTeamViewModel {
		private modalSelector = "#support-team-modal";
		private editButtonSelector = "#editSupportTeam";

		private itemId: number;
		

		private sectionsToUpdateOnSave: Array<string>;
		private isSaving = ko.observable<boolean>(false);
		private isLoading = ko.observable<boolean>(false);
		private supportTeams = ko.observableArray<Models.Employee>();
		private dbSupporTeams = ko.observableArray<Models.Employee>();
		
		selectedTranslators = ko.observableArray<Models.Employee>();
		selectedPreEditors = ko.observableArray<Models.Employee>();
		selectedProofReaders = ko.observableArray<Models.Employee>();
		selectedFirstLevelEditors = ko.observableArray<Models.Employee>();
		selectedGraphicDesigners = ko.observableArray<Models.Employee>();
		selectedTranslatorReviewers = ko.observableArray<Models.Employee>();
		selectedTranslatorProofReaders = ko.observableArray<Models.Employee>();
		selectedWriters = ko.observableArray<Models.Employee>();
		selectedEditors = ko.observableArray<Models.Employee>();

		private showCloseWarning = ko.observable<boolean>(false);
		private isDirty = ko.observable<boolean>(false);
		private disposables = Array<any>();

		//ko computed
		private canSave: any;
		onReady(json: { itemId: number; sectionsToUpdateOnSave: Array<string>; }) {
			this.itemId = json.itemId;
			this.sectionsToUpdateOnSave = json.sectionsToUpdateOnSave;

			EventUtilities.addHandlerToBody("click", this.editButtonSelector, this.showModal);
			this.canSave = ko.computed<boolean>(() => this.getCanSave(this.isSaving()));
			this.isDirty(false);
			ko.applyBindings(this, $(this.modalSelector)[0]);
		}

		getCanSave(isSaving: boolean): boolean {
			return !isSaving;
		}

		showModal = (event: JQueryEventObject) => {
			if (event) {
				event.preventDefault();
			}
			this.clearValues();
			setTimeout(() => this.getSupportTeamDetails(), 1);
			$(this.modalSelector).modal("show");
		}

		getSupportTeamDetails() {
			this.isLoading(true);
			SupportTeamService.getSupporTeamsByItemId(this.itemId)
				.done(this.onGetSupportTeamDetail)
				.always(() => this.isLoading(false));
		}

		onGetSupportTeamDetail = (response: ISupportTeamViewModel) => {
			var team = (response.SupportTeams || []).map((supportTeam) => {
				var employee = new Models.Employee(supportTeam.Id, supportTeam.EmployeeName, supportTeam.EmployeeId,
					 supportTeam.TypeId, supportTeam.NonEmployeeName, supportTeam.CreatedTimeUtc, supportTeam.CreatedByEmployeeId,
					supportTeam.ObjectState);
				return employee;
			});
			

			this.dbSupporTeams(team);

			this.supportTeams(team);

			this.selectedTranslators(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.Translator)));

			this.selectedPreEditors(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.PreEditor)));

			this.selectedProofReaders(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.ProofReader)));

			this.selectedFirstLevelEditors(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.TranslatorFle)));

			this.selectedGraphicDesigners(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.GraphicDesigner)));

			this.selectedTranslatorReviewers(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.TranslatorReviewer)));

			this.selectedTranslatorProofReaders(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.TranslatorProofReader)));

			this.selectedWriters(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.Writer)));

			this.selectedEditors(ko.utils.arrayFilter(this.supportTeams(), supportTeam => (supportTeam.TypeId === SupportTeamType.Editor)));

			this.subscribeEvents();
		}

		subscribeEvents() {
			this.disposables.push(this.selectedTranslators.subscribe(this.markDirty));
			this.disposables.push(this.selectedPreEditors.subscribe(this.markDirty));
			this.disposables.push(this.selectedProofReaders.subscribe(this.markDirty));
			this.disposables.push(this.selectedFirstLevelEditors.subscribe(this.markDirty));
			this.disposables.push(this.selectedGraphicDesigners.subscribe(this.markDirty));
			this.disposables.push(this.selectedTranslatorReviewers.subscribe(this.markDirty));
			this.disposables.push(this.selectedTranslatorProofReaders.subscribe(this.markDirty));
			this.disposables.push(this.selectedWriters.subscribe(this.markDirty));
			this.disposables.push(this.selectedEditors.subscribe(this.markDirty));
		}


		unSubscribeEvents() {
			this.disposables.forEach(disposable => {
				disposable.dispose();
			});
		}
		markDirty = () =>  {
			this.isDirty(true);
		}
		clearValues() {
			this.isDirty(false);
			$('employeecontrol').trigger('clearEmployeeInformation');
		}

		cancel = () => {
			this.clearValues();
			this.showCloseWarning(false);
			this.unSubscribeEvents();
			$(this.modalSelector).modal("hide");
		}

		alertNoClicked = () => {
			this.showCloseWarning(false);
		}

		closeModalButtonClicked = () => {
			if (this.isDirty()) {
				this.showCloseWarning(true);
				return false;
			} else {
				this.cancel();
			}
			return true;
		}
		save = () => {
			this.isSaving(true);
			var teamsToSave = Array<IEmployee>();
			var teams = this.selectedTranslators()
				.concat(this.selectedPreEditors())
				.concat(this.selectedProofReaders())
				.concat(this.selectedFirstLevelEditors())
				.concat(this.selectedGraphicDesigners())
				.concat(this.selectedTranslatorReviewers())
				.concat(this.selectedTranslatorProofReaders())
				.concat(this.selectedWriters())
				.concat(this.selectedEditors()).map(team => team.toJson());
						
			teams.forEach(employee => {
				var result = $.grep(this.dbSupporTeams(), e => (e.EmployeeId === employee.EmployeeId && e.TypeId === employee.TypeId));

				if (result.length === 0) {
					employee.ObjectState = ObjectStateEnum.Added;
					teamsToSave.push(employee);
				}
			});
			var dbTeam = this.dbSupporTeams();
			dbTeam.forEach(employee => {
				var result = $.grep(teams, e => (e.EmployeeId === employee.EmployeeId && e.TypeId === employee.TypeId));

				if (result.length === 0) {
					employee.ObjectState = ObjectStateEnum.Deleted;
					teamsToSave.push(employee);
				}
			});
			
			
			var supportTeamModel =<ISupportTeamViewModel> {
				'ItemId' : this.itemId,
				'SupportTeams' : teamsToSave
			};
			
			SupportTeamService.save(this.itemId, supportTeamModel)
				.done(() => {
					this.isDirty(false);
					this.showCloseWarning(false);
					this.unSubscribeEvents();
					$(this.modalSelector).modal("hide");
					UpdateHelper.updateAjaxPanels(this.sectionsToUpdateOnSave);
					toastr.success("Support Team Detail Saved");
				})
				.always(() => {
					this.isSaving(false);
				});
		}
	}
} 