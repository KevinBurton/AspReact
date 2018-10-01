module Gartner {
    
    /**
     * A list of Content Types Roles for selection.
     */
    export class ContentTypeRolesSelectionList {

        private showInactiveCheckBoxSelector: string;
        private inactiveRoleListItemsSelector: string;
        private selectAllCheckBoxSelector: string;
        private visibleRoleCheckBoxesSelector: string;
        private parentRoleCheckBoxesSelector: string;
        private childRoleCheckBoxesSelector: string;
        private dom = {
            showInactiveCheckBox: null,
            inactiveRoleListItems: null,
            selectAllCheckBox: null,
            parentRoleCheckBoxes: null
        };

        onReady = (json: { showInactiveCheckBoxSelector: string, inactiveRoleListItemsSelector: string, selectAllCheckBoxSelector: string, visibleRoleCheckBoxesSelector: string, parentRoleCheckBoxesSelector: string, childRoleCheckBoxesSelector: string }) => {
            this.load(json);
        }

        load = (json: { showInactiveCheckBoxSelector: string, inactiveRoleListItemsSelector: string, selectAllCheckBoxSelector: string, visibleRoleCheckBoxesSelector: string, parentRoleCheckBoxesSelector: string, childRoleCheckBoxesSelector: string }) => {
            this.showInactiveCheckBoxSelector = json.showInactiveCheckBoxSelector;
            this.inactiveRoleListItemsSelector = json.inactiveRoleListItemsSelector;
            this.selectAllCheckBoxSelector = json.selectAllCheckBoxSelector;
            this.visibleRoleCheckBoxesSelector = json.visibleRoleCheckBoxesSelector;
            this.parentRoleCheckBoxesSelector = json.parentRoleCheckBoxesSelector;
            this.childRoleCheckBoxesSelector = json.childRoleCheckBoxesSelector;
            this.render();
        }

        render = () => {
            this.bindDom()            
            this.bindEvents();
            this.toggleInactive();
        }

        bindDom = () => {
            this.dom.showInactiveCheckBox = $(this.showInactiveCheckBoxSelector);
            this.dom.inactiveRoleListItems = $(this.inactiveRoleListItemsSelector);
            this.dom.selectAllCheckBox = $(this.selectAllCheckBoxSelector);            
            this.dom.parentRoleCheckBoxes = $(this.parentRoleCheckBoxesSelector);
        }

        bindEvents = () => {
            var self = this;
            this.dom.showInactiveCheckBox.on('click', function () {
                self.toggleInactive();
            });
            this.dom.selectAllCheckBox.on('click', function () {
                self.toggleSelectAll();
            });
            this.dom.parentRoleCheckBoxes.on('click', function () {
                self.toggleChildRoles(this);
            });
        }

        toggleInactive = () => {     
            if (this.dom.showInactiveCheckBox.is(':checked')) {
                this.dom.inactiveRoleListItems.show();
            } else {
                this.dom.inactiveRoleListItems.hide();
            }
        }

        toggleSelectAll = () => {
            if (this.dom.selectAllCheckBox.is(':checked'))
                $(this.visibleRoleCheckBoxesSelector).prop("checked", true);
            else
                $(this.visibleRoleCheckBoxesSelector).prop("checked", false);
        }

        toggleChildRoles = (element) => {
            var childRoles = $(element).parent().find(this.childRoleCheckBoxesSelector)
            if ($(element).is(':checked')) {
                childRoles.prop("checked", true);
            } else {
                childRoles.prop("checked", false);
            }
        }
	}
}