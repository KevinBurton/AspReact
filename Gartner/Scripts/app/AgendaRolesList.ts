/// <reference path="../typings/handlebars/handlebars.d.ts" />

module Gartner {

    export class AgendaRolesList {

        private agendaId: number;
        private containerSelector: string;
        private rolesListSelector: string;
        private rolesListTemplateSelector: string;
        private rolesSelector: string;
        private rolesModalOpenButtonSelector: string;
        private contentTypesPartialContainerSelector: string;
        private loadContentTypesUrl: string;
        private rolesSelectionList: AgendaRolesSelectionList;
        private contentTypesSelectionList: AgendaContentTypesSelectionList;
        private compiledRolesListTemplate = null;
        private dom = {
            container: null,
            contentTypesPartialContainer: null
        };

        onReady = (
            params: {
                agendaId: number,
                containerSelector: string,
                rolesListSelector: string,
                rolesListTemplateSelector: string,
                rolesSelector: string,
                rolesModalOpenButtonSelector: string,
                contentTypesPartialContainerSelector: string,
                loadContentTypesUrl: string
            }
        ) => {
            this.agendaId = params.agendaId;
            this.containerSelector = params.containerSelector;
            this.rolesListSelector = params.rolesListSelector;
            this.rolesListTemplateSelector = params.rolesListTemplateSelector;
            this.rolesSelector = params.rolesSelector;           
            this.rolesModalOpenButtonSelector = params.rolesModalOpenButtonSelector;
            this.contentTypesPartialContainerSelector = params.contentTypesPartialContainerSelector;
            this.loadContentTypesUrl = params.loadContentTypesUrl;
            this.rolesSelectionList = Gartner.instanceOf("AgendaRolesSelectionList");
            this.rolesSelectionList.agendaId = this.agendaId;
            this.rolesSelectionList.okButtonClickedCallback = this.rolesModalOkButtonClicked;
            this.contentTypesSelectionList = Gartner.instanceOf("AgendaContentTypesSelectionList");
            this.init();
        };

        init = () => {
            this.bindDom();
            this.bindEvents();
        };

        bindDom = () => {
            this.dom.container = $(this.containerSelector);
            this.dom.contentTypesPartialContainer = $(this.contentTypesPartialContainerSelector);
        };

        bindEvents = () => {
            var self = this;
            this.dom.container.on('click', this.rolesModalOpenButtonSelector, function () {
                self.openRolesModal();
            });
        };

        rolesListTemplate = (templateModel) => {
            if (this.compiledRolesListTemplate == null) {
                var templateHtml = $(this.rolesListTemplateSelector).html();
                this.compiledRolesListTemplate = Handlebars.compile(templateHtml);
            }
            return this.compiledRolesListTemplate(templateModel);
        };

        getRoles = () => {
            return this.dom.container.find(this.rolesSelector).map(function () {
                return {
                    Id: $(this).attr('data-id'),
                    Name: $(this).attr('data-name')
                };
            });
        };

        openRolesModal = () => {
            this.rolesSelectionList.dom.container.modal("show");
            var roles = this.getRoles();
            this.rolesSelectionList.loadRoles(roles);
        };

        rolesModalOkButtonClicked = () => {
            var selectedRoles = this.rolesSelectionList.getSelectedRoles();
            this.rolesSelectionList.dom.container.modal("hide");
            this.updateRolesList(selectedRoles);
            this.updateContentTypesList(selectedRoles);
        };

        updateRolesList = (roles) => {
            var rolesList = this.dom.container.find(this.rolesListSelector);
            rolesList.empty();
            roles = this.sortRoles(roles);
            rolesList.append(this.rolesListTemplate(roles));
        };

        sortRoles = (roles) => {
            return roles.sort((r1, r2) => {
                if (r1.Name > r2.Name) {
                    return 1;
                }
                if (r1.Name < r2.Name) {
                    return -1;
                }
                return 0;
            });
        };

        updateContentTypesList = (roles) => {
            var self = this;
            var rolesIds = $.map(roles, function (role) {
                return role.Id;
            });
            this.dom.contentTypesPartialContainer.empty();
            this.dom.contentTypesPartialContainer.load(this.loadContentTypesUrl, { agendaId: this.agendaId, roleIds: rolesIds }, function () {
                self.contentTypesSelectionList.init();
            });
        };
    }

    export class AgendaRolesSelectionList {

        public agendaId: number;
        private containerSelector: string;
        private loaderContainerSelector: string;
        private contentContainerSelector: string;
        private selectableRoleParentsSelector: string;
        private selectableRolesSelector: string;
        private loadRolesUrl: string;
        private showInactiveCheckBoxSelector: string;
        private selectAllCheckBoxSelector: string;
        private okButtonSelector: string;
        private cancelButtonSelector: string;
        public okButtonClickedCallback;

        public dom = {
            container: null
        };

        onReady = (
            params: {
                containerSelector: string,
                selectableRoleParentsSelector: string,
                selectableRolesSelector: string,
                loaderContainerSelector: string,
                contentContainerSelector: string,
                showInactiveCheckBoxSelector: string,
                selectAllCheckBoxSelector: string,
                okButtonSelector: string,
                cancelButtonSelector: string,
                loadRolesUrl: string
            }
        ) => {
            this.containerSelector = params.containerSelector;
            this.selectableRoleParentsSelector = params.selectableRoleParentsSelector;
            this.selectableRolesSelector = params.selectableRolesSelector;
            this.loaderContainerSelector = params.loaderContainerSelector;
            this.contentContainerSelector = params.contentContainerSelector;
            this.showInactiveCheckBoxSelector = params.showInactiveCheckBoxSelector;
            this.selectAllCheckBoxSelector = params.selectAllCheckBoxSelector;
            this.okButtonSelector = params.okButtonSelector;
            this.cancelButtonSelector = params.cancelButtonSelector;
            this.loadRolesUrl = params.loadRolesUrl;
            this.init();
        };

        init = () => {
            this.bindDom();
            this.bindEvents();            
        };

        bindDom = () => {
            this.dom.container = $(this.containerSelector);
        };

        bindEvents = () => {
            var self = this;
            this.dom.container.on('click', this.okButtonSelector, function () {
                self.okButtonClickedCallback();
            });
            this.dom.container.on('click', this.cancelButtonSelector, function () {
                self.dom.container.modal("hide");
            });
            this.dom.container.on('click', this.showInactiveCheckBoxSelector, function () {
                self.toggleInactive(this);
            });
            this.dom.container.on('click', this.selectAllCheckBoxSelector, function () {
                self.toggleSelectAll(this);
            });
            this.dom.container.on('click', this.selectableRoleParentsSelector, function () {
                self.toggleSelectChildRoles(this);
            });
        }

        loadRoles = (roles) => {
            var self = this;
            var loaderContainer = this.dom.container.find(this.loaderContainerSelector);
            var contentContainer = this.dom.container.find(this.contentContainerSelector);
            if (contentContainer.is(':empty')) {
                contentContainer.hide();
                loaderContainer.show();
                contentContainer.load(this.loadRolesUrl, function () {
                    self.checkSelectedRoles(roles);
                    self.toggleInactive(self.dom.container.find(self.showInactiveCheckBoxSelector));
                    loaderContainer.hide();
                    contentContainer.show();
                });
            } else {
                this.checkSelectedRoles(roles);
            }
        };

        checkSelectedRoles = (roles) => {
            var selectableParents = this.dom.container.find(this.selectableRoleParentsSelector);
            $.each(selectableParents, function () {
                $(this).prop("checked", false);
            });
            var selectableRoles = this.dom.container.find(this.selectableRolesSelector);
            $.each(selectableRoles, function () {
                $(this).prop("checked", false);
            });
            selectableRoles.map(function () {
                let selectableRole = $(this);
                $.grep(roles, function (r) {
                    if (r["Id"] == $(selectableRole).attr('data-id')) {
                        $(selectableRole).prop("checked", true);
                        return true;
                    }
                });
            });
        }

        getSelectedRoles = () => {
            return this.dom.container.find(this.selectableRolesSelector + ':checked').map(function () {
                return new AgendaDetailsViewModel.RoleViewModel({
                    Id: $(this).attr('data-id'),
                    Name: $(this).attr('data-name'),
                    IsActive: $(this).attr('data-isactive')
                });
            }).get();
        };

        toggleInactive = (element) => {           
            var inactiveRoles = this.dom.container.find(this.selectableRolesSelector + '[data-isactive="false"]').parent();
            if ($(element).is(':checked')) {
                inactiveRoles.show();
            } else {
                inactiveRoles.hide();
            }
        }

        toggleSelectAll = (element) => {
            if ($(element).is(':checked')) {
                this.dom.container.find(this.selectableRolesSelector + ':visible').prop("checked", true);
            } else {
                this.dom.container.find(this.selectableRolesSelector + ':visible').prop("checked", false);
            }
        }

        toggleSelectChildRoles = (element) => {
            var childRoles = $(element).parent().find(this.selectableRolesSelector + ':visible');
            if ($(element).is(':checked')) {
                childRoles.prop("checked", true);
            } else {
                childRoles.prop("checked", false);
            }
        }
    }

    export class AgendaContentTypesSelectionList {

        private containerSelector: string;
        private contentTypesSelector: string;
        private showInactiveCheckBoxSelector: string;

        public dom = {
            container: null
        };

        onReady = (
            params: {
                containerSelector: string,
                contentTypesSelector: string,
                showInactiveCheckBoxSelector: string
            }
        ) => {
            this.containerSelector = params.containerSelector;
            this.contentTypesSelector = params.contentTypesSelector;
            this.showInactiveCheckBoxSelector = params.showInactiveCheckBoxSelector;
            this.init();
        };

        init = () => {
            this.bindDom();
            this.bindEvents();
            this.toggleInactive(this.dom.container.find(this.showInactiveCheckBoxSelector));
        };

        bindDom = () => {
            this.dom.container = $(this.containerSelector);
        };

        bindEvents = () => {
            var self = this;
            this.dom.container.on('click', this.showInactiveCheckBoxSelector, function () {
                self.toggleInactive(this);
            });
        };

        getUnselectedContentTypes = () => {
            return this.dom.container.find(this.contentTypesSelector + ':not(:checked)').map(function () {
                return new AgendaDetailsViewModel.ContentTypeExcludeViewModel({
                    ContentTypeId: $(this).attr('data-contenttypeid'),
                    ContentSubtypeId: $(this).attr('data-contentsubtypeid')
                });
            }).get();
        };

        toggleInactive = (element) => {
            var inactiveContentTypes = this.dom.container.find(this.contentTypesSelector + '[data-isactive="false"]').parent();
            if ($(element).is(':checked')) {
                inactiveContentTypes.show();
            } else {
                inactiveContentTypes.hide();
            }
        }
    }
}