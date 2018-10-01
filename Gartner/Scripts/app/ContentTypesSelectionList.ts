module Gartner {
    
    /**
     * A list of Content Types Roles for selection.
     */
    export class ContentTypeSelectionList {

        private showInactiveCheckBoxSelector: string;
        private inactiveRoleListItemsSelector: string;
        private dom = {
            showInactiveCheckBox: null,
            inactiveRoleListItems: null
        };

        onReady = (json: { showInactiveCheckBoxSelector: string, inactiveRoleListItemsSelector: string }) => {
            this.load(json);
        }

        load = (json: { showInactiveCheckBoxSelector: string, inactiveRoleListItemsSelector: string }) => {
            this.showInactiveCheckBoxSelector = json.showInactiveCheckBoxSelector;
            this.inactiveRoleListItemsSelector = json.inactiveRoleListItemsSelector;
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
        }

        bindEvents = () => {
            var self = this;
            this.dom.showInactiveCheckBox.unbind('click'); 
            this.dom.showInactiveCheckBox.on('click', function () {
                self.toggleInactive();
            });
        }

        toggleInactive = () => {         
            if (this.dom.showInactiveCheckBox.is(':checked')) {
                this.dom.inactiveRoleListItems.show();
            } else {
                this.dom.inactiveRoleListItems.hide();
            }
        }
	}
}