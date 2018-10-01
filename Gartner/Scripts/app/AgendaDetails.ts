/// <reference path="../typings/handlebars/handlebars.d.ts" />

module Gartner {

    export class AgendaDetails {

        private agendaId: number;
        private saveButtonSelector: string;
        private idSelector: string;
        private statusSelector: string;
        private nameSelector: string;
        private keyInitiativesSelector: string;
        private refinementTopicsSelector: string;
        private clientQuestionsSelector: string;
        private agendaManagerSelector: string;
        private chiefOfResearchSelector: string;
        private backupManagersSelector: string;

        private dom = {
            saveButton: null
        };

        onReady = (params: {
            agendaId: number,
            saveButtonSelector: string,
            idSelector: string,
            statusSelector: string,
            nameSelector: string,
            keyInitiativesSelector: string,
            refinementTopicsSelector: string,
            clientQuestionsSelector: string,
            agendaManagerSelector: string,
            chiefOfResearchSelector: string,
            backupManagersSelector: string
        }) => {
            this.agendaId = params.agendaId,
            this.saveButtonSelector = params.saveButtonSelector;
            this.idSelector = params.idSelector;
            this.statusSelector = params.statusSelector;
            this.nameSelector = params.nameSelector;
            this.keyInitiativesSelector = params.keyInitiativesSelector;
            this.refinementTopicsSelector = params.refinementTopicsSelector;
            this.clientQuestionsSelector = params.clientQuestionsSelector;
            this.agendaManagerSelector = params.agendaManagerSelector;
            this.chiefOfResearchSelector = params.chiefOfResearchSelector;
            this.backupManagersSelector = params.backupManagersSelector

            this.init();
        }

        init = () => {
            this.bindDom()
            this.bindEvents();
        }

        bindDom = () => {
            this.dom.saveButton = $(this.saveButtonSelector);
        }

        bindEvents = () => {
            var self = this;
            this.dom.saveButton.on('click', function () {
                self.saveAgenda();
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

        getNameFromForm = () => {
            return $(this.nameSelector).val();
        }

        getKeyInitiativesFromForm = () => {
            var keyInitiatives = new Array();
            $.each($(this.keyInitiativesSelector), function () {
                var keyInitiative = new AgendaDetailsViewModel.KeyInitiativeViewModel({
                    Id: $(this).attr('data-id'),
                    Name: $(this).attr('data-name')
                });
                keyInitiatives.push(keyInitiative)
            });
            return keyInitiatives;
        }

        getRefinementTopicsFromForm = () => {
            var self = this;
            var refinementTopics = new Array();
            $.each($(this.refinementTopicsSelector), function () {
                var clientQuestions = new Array();
                $.each($(this).closest('.item-root').find(self.clientQuestionsSelector), function () {
                    var clientQuestion = new AgendaDetailsViewModel.ClientQuestionViewModel({
                        Id: $(this).attr('data-id'),
                        Name: $(this).attr('data-name')
                    });
                    clientQuestions.push(clientQuestion)
                });
                var refinementTopic = new AgendaDetailsViewModel.RefinementTopicViewModel({
                    Id: $(this).attr('data-id'),
                    Name: $(this).attr('data-name'),
                    ClientQuestions: clientQuestions
                });
                refinementTopics.push(refinementTopic)
            });
            return refinementTopics;
        }

        getAgendaManagerFromForm = () => {
            var agendaManagerField = $(this.agendaManagerSelector);
            var agendaManager = null;
            if (agendaManagerField.length > 0) {
                agendaManager = new AgendaDetailsViewModel.EmployeeViewModel({
                    Id: agendaManagerField.attr('data-id'),
                    LastFirstName: agendaManagerField.attr('data-lastfirstname')
                });
            }
            return agendaManager;
        }

        getChiefOfResearchFromForm = () => {
            var chiefOfResearchField = $(this.chiefOfResearchSelector);
            var chiefOfResearch = null;
            if (chiefOfResearchField.length > 0) {
                chiefOfResearch = new AgendaDetailsViewModel.EmployeeViewModel({
                    Id: chiefOfResearchField.attr('data-id'),
                    LastFirstName: chiefOfResearchField.attr('data-lastfirstname')
                });
            }
            return chiefOfResearch;
        }

        getBackupManagersFromForm = () => {
            var backupManagers = new Array();
            $.each($(this.backupManagersSelector), function () {
                var backupManager = new AgendaDetailsViewModel.EmployeeViewModel({
                    Id: $(this).attr('data-id'),
                    LastFirstName: $(this).attr('data-lastfirstname')
                });
                backupManagers.push(backupManager)
            });
            return backupManagers;
        }

        getRolesFromForm = () => {
            var roles = new Array();
            $.each($('#rolesWrapper').find('#rolesSummary').find('.role'), function () {
                var role = new AgendaDetailsViewModel.RoleViewModel({
                    Id: $(this).attr('data-id'),
                    Name: $(this).attr('data-name'),
                    IsActive: $(this).attr('data-isactive')
                });
                roles.push(role)
            });
            return roles;
        }

        getContentTypeExclusionFromForm = () => {
            var excludes = new Array();
            $.each($('#contentTypesSummary').find('.childRole:not(:checked)'), function () {
                var exclude = new AgendaDetailsViewModel.ContentTypeExcludeViewModel({
                    ContentTypeId: $(this).attr('data-contenttypeid'),
                    ContentSubtypeId: $(this).attr('data-contentsubtypeid')
                });
                excludes.push(exclude)
            });
            return excludes;
        }

        saveAgenda = () => {
            var self = this;
            var agenda = new AgendaDetailsViewModel();
            agenda.Id = this.getIdFromForm();
            agenda.Name = this.getNameFromForm();
            agenda.StatusId = this.getStatusFromForm();
            agenda.KeyInitiatives = this.getKeyInitiativesFromForm();
            agenda.RefinementTopics = this.getRefinementTopicsFromForm();
            agenda.AgendaManager = this.getAgendaManagerFromForm();
            agenda.ChiefOfResearch = this.getChiefOfResearchFromForm();
            agenda.BackupManagers = this.getBackupManagersFromForm();
            agenda.Roles = this.getRolesFromForm();
            agenda.ContentTypeExclusion = this.getContentTypeExclusionFromForm();
            if (this.validateAgenda(agenda)) {
                if (agenda.Id == 0) {
                    AdministrationService.createAgenda(agenda)
                        .then(response => {
                            return self.updateView(response)
                        })
                        .done(() => {
                            toastr.success('Created Agenda.');
                        });
                } else {
                    AdministrationService.updateAgenda(agenda)
                        .then(response => {
                            return self.updateView(response)
                        })
                        .done(() => {
                            toastr.success('Updated Agenda.');
                        });
                }
            }
        }

        validateAgenda = (agenda) => {
            var messages = new Array();
            if (agenda.StatusId == "0") {// Active
                if (agenda.Name == "") {
                    messages.push("Name is required when Status is set to Active.");
                }
                if (agenda.Roles.length == 0) {
                    messages.push("Roles are required when Status is set to Active.");
                }
                if (agenda.AgendaManager == null) {
                    messages.push("Agenda Manager is required when Status is set to Active.");
                }
                if (agenda.ChiefOfResearch == null) {
                    messages.push("Chief Of Research is required when Status is set to Active.");
                }
            } else if (agenda.StatusId == "2") { //Pending
                if (agenda.Name == "") {
                    messages.push("Name is required when Status is set to Pending.");
                }
            }
            if (messages.length > 0) {
                toastr.error(messages.join("<br />"));
                return false;
            }
            return true;
        }

        updateView = (agendaId) => {
            var self = this;
            this.setIdToForm(agendaId);
            $("#refinementTopicsPartialWrapper").load("/Administration/RefreshAgenda", { id: agendaId }, function () {
                var rt = Gartner.instanceOf("EditableAccordionList");
                rt.render();
            });
        }
    }
}