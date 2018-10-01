module Gartner {

	interface KendoEvent {
		sender: {
			value: () => string;
			text: () => string;
		}
	}

	export class AgendasViewModel {
		public itemId: number;
		private comboBoxSelector = "#agenda-combo";
		private sectionsToUpdateOnSave: Array<string>;
		private agendas = ko.observableArray<AgendaViewModel>();
		private selectedPrimaryAgenda = ko.observable<AgendaViewModel>();
		private isSaving = ko.observable<boolean>(false);
		private isLoading = ko.observable<boolean>(false);

		private primaryAgenda: any;
		private agendaReadyForAdd: any;
		private canSave: any;
		private addButtonText: any;
		private warningMessage : string;
		constructor(itemId: number, modalShown: KnockoutObservable<boolean>, sectionsToUpdateOnSave: Array<string>) {
			this.itemId = itemId;
			this.sectionsToUpdateOnSave = sectionsToUpdateOnSave;
			this.clearAgendaCombo();
			this.setupComputedFields();

			modalShown.subscribe((isShown) => {
				if (isShown) {
					this.load();
				}
			});
		}

		load = () => {
			this.isLoading(true);
			AgendaService.getAgendasByItemId(this.itemId)
				.done(agendas => {
					this.agendas(agendas);
					this.setDefaultPrimaryKeyInitiative();
				})
				.always(() => this.isLoading(false));
		}

		setDefaultPrimaryKeyInitiative = () => {
			this.agendas().forEach(agenda => {
				var hasPrimaryKeyInitiative = agenda.keyInitiatives().filter(ki => ki.primary()).length > 0;
				if (!hasPrimaryKeyInitiative && agenda.keyInitiatives().length > 0) {
					agenda.keyInitiatives()[0].primary(true);
				}
			});
		}

		clearAgendaCombo() {
			var comboBox = $(this.comboBoxSelector).data("kendoComboBox");
			if (comboBox) {
				comboBox.destroy();
			}

			$(this.comboBoxSelector).kendoComboBox(<any>{
				dataSource: AgendaService.getAgendasComboBoxDataSource(),
				dataTextField: "DisplayText",
				delay: 400,
				filter: "contains",
				minLength: 1,
				autoBind: false,
				dataValueField: "AgendaId",
				highlightFirst: true,
				placeholder: "Select agenda...",
				change: (e: KendoEvent) => {
					this.setSelectedPrimaryAgenda(e.sender.value(), e.sender.text());
				}
			});
		}

		setupComputedFields = () => {
			this.primaryAgenda = ko.computed<AgendaViewModel>(() => {
				var agendas = this.agendas();
				if (!agendas || agendas.length === 0) return undefined;

				return agendas.filter(a => a.primary)[0];
			});

			this.canSave = ko.computed<boolean>(() => !this.isSaving() && !this.isLoading());
			this.addButtonText = ko.computed<string>(() => this.primaryAgenda() !== undefined ? "Update" : "Add");
			this.agendaReadyForAdd = ko.computed<boolean>(() => this.selectedPrimaryAgenda() !== undefined);
		}

		setSelectedPrimaryAgenda = (value: string, text: string) => {
			// to ensure only primary agenda, when we add secondary agendas, this will change.
			if (!value) return;
			if (this.addButtonText() === "Update") {
				this.warningMessage = "Content Type Details will be Cleared on Save";
			} else {
				this.warningMessage = null;
			}
			this.selectedPrimaryAgenda(new AgendaViewModel({
				agendaId: +value,
				name: text,
				primary: true
			}));
		}

		addUpdatePrimaryAgenda = () => {
			var primaryAgenda = this.primaryAgenda();
			if (primaryAgenda !== undefined) {
				this.agendas.remove(primaryAgenda);
			}

			if (this.warningMessage !== null) {
				toastr.warning(this.warningMessage);
			}

			this.agendas.push(this.selectedPrimaryAgenda());
			(<any>$(this.comboBoxSelector).data("kendoComboBox")).clear();
			this.selectedPrimaryAgenda(undefined);

			KeyInitiativeService.getKeyInitiativesByAgendaId(this.primaryAgenda().agendaId)
				.done((keyInitiatives) => {
					this.primaryAgenda().withKeyInitiatives(keyInitiatives);
					this.setDefaultPrimaryKeyInitiative();
				});

			RoleService.getRolesByAgendaId(this.primaryAgenda().agendaId)
				.done((roles) => {
					this.primaryAgenda().withRoles(roles);
				});
		}

		removeAgenda = (agenda: AgendaViewModel) => {
			this.agendas.remove(agenda);
		}

		save = () => {
			this.isSaving(true);
			this.warningMessage = null;
			AgendaService.save(this.itemId, this.agendas())
				.done((agendas) => {
					this.agendas(agendas);
					UpdateHelper.updateAjaxPanels(this.sectionsToUpdateOnSave);
					$('edit-content-types').trigger('reloadContentTypeInformation');
					toastr.success("Agendas Saved");
				})
				.fail(response => {
					if (typeof response === "string") {
						ErrorUtilities.clearErrors();
						ErrorUtilities.showErrorMessage("Agenda Information", response);	
					}
				})
				.always(() => {
					
					this.isSaving(false);
				});
		}
	}

} 