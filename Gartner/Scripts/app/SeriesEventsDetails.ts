/// <reference path="../typings/handlebars/handlebars.d.ts" />

module Gartner {

	export class SeriesEventsDetails {

		private seriesEventId: number;
		private saveButtonSelector: string;
		private idSelector: string;
		private statusSelector: string;
		private titleSelector: string;
		private researchLeadSelector: string;
		private contentPlannerSelector: string;
		private eventManagerSelector: string;
		private conferenceChairSelector: string;
		private eventInputId = "seriesEventAssignmentComboBox";
		private eventSelector: string;
		private addButtonSelector: string;
		private suppressMessages = 'no';

		private dom = {
			saveButton: null,
			addButton: null
		};

		onReady = (params: {
			seriesEventId: number,
			saveButtonSelector: string,
			idSelector: string,
			statusSelector: string,
			titleSelector: string,
			researchLeadSelector: string,
			contentPlannerSelector: string,
			eventManagerSelector: string,
			conferenceChairSelector: string,
			eventSelector: string,
			addButtonSelector: string

		}) => {
			this.seriesEventId = params.seriesEventId,
				this.saveButtonSelector = params.saveButtonSelector;
			this.idSelector = params.idSelector;
			this.statusSelector = params.statusSelector;
			this.titleSelector = params.titleSelector;
			this.researchLeadSelector = params.researchLeadSelector;
			this.conferenceChairSelector = params.conferenceChairSelector;
			this.contentPlannerSelector = params.contentPlannerSelector;
			this.eventManagerSelector = params.eventManagerSelector;
			this.eventSelector = params.eventSelector;
			this.addButtonSelector = params.addButtonSelector;

			this.init();
		}

		init = () => {
			this.bindDom()
			this.bindEvents();
		}

		bindDom = () => {
			this.dom.saveButton = $(this.saveButtonSelector);
			this.dom.addButton = $(this.addButtonSelector);
		}

		bindEvents = () => {
			var self = this;
			this.dom.saveButton.on('click',
				function () {
					self.saveSeriesEventFinal();
				});
			this.dom.addButton.on('click',
				function () {
					self.addEvent();
				});

		}

		setIdToForm = (id: string) => {
			return $(this.idSelector).val(id);
		}


		getIdFromForm = () => {
			return $(this.idSelector).val();
		}

		getStatusFromForm = () => {
			return $(this.statusSelector).val();
		}

		getTitleFromForm = () => {
			return $(this.titleSelector).val();
		}

		getResearchLeadFromForm = () => {
			var researchLeadField = $(this.researchLeadSelector);
			var researchLead = null;
			if (researchLeadField.length > 0) {
				researchLead = new SeriesEventsDetailsViewModel.EmployeeViewModel({
					Id: researchLeadField.attr('data-id'),
					LastFirstName: researchLeadField.attr('data-lastfirstname')
				});
			}
			return researchLead;
		}

		getContentPlannerFromForm = () => {
			var contentPlannerField = $(this.contentPlannerSelector);
			var contentPlanner = null;
			if (contentPlannerField.length > 0) {
				contentPlanner = new SeriesEventsDetailsViewModel.EmployeeViewModel({
					Id: contentPlannerField.attr('data-id'),
					LastFirstName: contentPlannerField.attr('data-lastfirstname')
				});
			}
			return contentPlanner;
		}

		getEventManagerFromForm = () => {
			var eventManagerField = $(this.eventManagerSelector);
			var eventManager = null;
			if (eventManagerField.length > 0) {
				eventManager = new SeriesEventsDetailsViewModel.EmployeeViewModel({
					Id: eventManagerField.attr('data-id'),
					LastFirstName: eventManagerField.attr('data-lastfirstname')
				});
			}
			return eventManager;
		}

		getConferenceChairFromForm = () => {
			var conferenceChairField = $(this.conferenceChairSelector);
			var conferenceChair = null;
			if (conferenceChairField.length > 0) {
				conferenceChair = new SeriesEventsDetailsViewModel.EmployeeViewModel({
					Id: conferenceChairField.attr('data-id'),
					LastFirstName: conferenceChairField.attr('data-lastfirstname')
				});
			}
			return conferenceChair;
		}

		getEventFromForm = () => {
			return $(this.eventSelector).val();
		}

		addEvent = () => {
			var self = this;
			var seriesEvent = new SeriesEventsDetailsViewModel();
			seriesEvent.Id = this.getIdFromForm();
			seriesEvent.Title = this.getTitleFromForm();
			seriesEvent.StatusId = this.getStatusFromForm();
			seriesEvent.ResearchLead = this.getResearchLeadFromForm();
			seriesEvent.ConferenceChair = this.getConferenceChairFromForm();
			seriesEvent.ContentPlanner = this.getContentPlannerFromForm();
			seriesEvent.EventManager = this.getEventManagerFromForm();
			var eventField = $(this.eventSelector);
			var url;
			var messages = new Array();
			if (eventField.length > 0) {
				if (this.validateEventSeries(seriesEvent)) {
					self.saveForKey();

					var myVar = setInterval(() => {

						if (this.getIdFromForm() > 0) { clearInterval(myVar); }

						AdministrationService.addEvent(this.getEventFromForm(), this.getIdFromForm())
							.done(response => {

								url = "/Administration/EditSeriesEvent/" + this.getIdFromForm();
								window.location.href = url;

								toastr.success('Event Added to Event Series');
							});
					},
						1800);
				}
			}
		}

		saveForKey = () => {
			var self = this;
			var seriesEvent = new SeriesEventsDetailsViewModel();
			seriesEvent.Id = this.getIdFromForm();
			seriesEvent.Title = this.getTitleFromForm();
			seriesEvent.StatusId = this.getStatusFromForm();
			seriesEvent.ResearchLead = this.getResearchLeadFromForm();
			seriesEvent.ConferenceChair = this.getConferenceChairFromForm();
			seriesEvent.ContentPlanner = this.getContentPlannerFromForm();
			seriesEvent.EventManager = this.getEventManagerFromForm();

			if (this.validateEventSeries(seriesEvent)) {
				if (seriesEvent.Id == 0) {
					AdministrationService.createSeriesEvent(seriesEvent)
						.done((response) => {
							this.setIdToForm(response.toString());
							toastr.success('Created Event Series.' + response.toString());

						});
				} else {
					AdministrationService.updateSeriesEvent(seriesEvent)
						.done((response) => {
							this.setIdToForm(response.toString());
							toastr.success('Updated Event Series.' + response.toString());

						});
				}
			}
		}

		saveSeriesEvent = () => {
			var self = this;
			var seriesEvent = new SeriesEventsDetailsViewModel();
			seriesEvent.Id = this.getIdFromForm();
			seriesEvent.Title = this.getTitleFromForm();
			seriesEvent.StatusId = this.getStatusFromForm();
			seriesEvent.ResearchLead = this.getResearchLeadFromForm();
			seriesEvent.ConferenceChair = this.getConferenceChairFromForm();
			seriesEvent.ContentPlanner = this.getContentPlannerFromForm();
			seriesEvent.EventManager = this.getEventManagerFromForm();

			if (this.validateEventSeries(seriesEvent)) {
				if (seriesEvent.Id == 0) {
					AdministrationService.createSeriesEvent(seriesEvent)
						.done((response) => {
							this.setIdToForm(response.toString());
							toastr.success('Created Event Series.' + response.toString());

						});
				} else {
					AdministrationService.updateSeriesEvent(seriesEvent)
						.done(() => {
							toastr.success('Updated Event Series.');

						});
				}
			}
		}


		validateEventSeries = (seriesEvent) => {
			var messages = new Array();
			var grid = $("#seriesEventsAssignmentGrid").data("kendoGrid");
			var count = grid.dataSource.total();


			if (seriesEvent.Title == "") {
				messages.push("A Title for the Event Series is required.");
			}
			if (seriesEvent.ResearchLead == null) {
				messages.push("Research Event Lead is required.");
			}
			if (this.getEventFromForm() == '') {
				messages.push("Please choose an event to add.");
			}
			if (messages.length > 0) {
				toastr.error(messages.join("<br />"));
				return false;
			}

			return true;
		}


		saveSeriesEventFinal = () => {
			var self = this;
			var seriesEvent = new SeriesEventsDetailsViewModel();
			seriesEvent.Id = this.getIdFromForm();
			seriesEvent.Title = this.getTitleFromForm();
			seriesEvent.StatusId = this.getStatusFromForm();
			seriesEvent.ResearchLead = this.getResearchLeadFromForm();
			seriesEvent.ConferenceChair = this.getConferenceChairFromForm();
			seriesEvent.ContentPlanner = this.getContentPlannerFromForm();
			seriesEvent.EventManager = this.getEventManagerFromForm();

			if (this.validateAllEventSeries(seriesEvent)) {
				if (seriesEvent.Id == 0) {
					AdministrationService.createSeriesEvent(seriesEvent)
						.done(() => {
							toastr.success('Created Event Series.');

						});
				} else {
					AdministrationService.updateSeriesEvent(seriesEvent)
						.done(() => {
							toastr.success('Updated Event Series.');

						});
				}
			}
		}

		validateAllEventSeries = (seriesEvent) => {
			var messages = new Array();
			var grid = $("#seriesEventsAssignmentGrid").data("kendoGrid");
			var count = grid.dataSource.total();

			if (seriesEvent.Title == "") {
				messages.push("A Title for the Event Series is required.");
			}
			if (seriesEvent.ResearchLead == null) {
				messages.push("Research Event Lead is required.");
			}
			if (count == 0) {
				messages.push("An Event must be assigned.");
			}
			if (messages.length > 0) {
				toastr.error(messages.join("<br />"));
				return false;
			}

			return true;
		}

		updateView = (seriesEventId) => {
			var self = this;
			this.setIdToForm(seriesEventId);
			$("#refinementTopicsPartialWrapper")
				.load("/Administration/RefreshEventSeries",
				{ id: seriesEventId },
				function () {
					var rt = Gartner.instanceOf("EditableAccordionList");
					rt.render();
				});
		}
	}
}
