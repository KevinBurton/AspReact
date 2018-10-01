module Gartner {
    
    /**
     * A list of Content Types.
     */
    export class ContentTypesList {

        private showInactiveCheckBoxSelector: string;
        private inactiveContentTypeListItemsSelector: string;
        private dom = {
            showInactiveCheckBox: null,
            inactiveContentTypeListItems: null
        };

        onReady = (json: { showInactiveCheckBoxSelector: string, inactiveContentTypeListItemsSelector: string }) => {
            this.showInactiveCheckBoxSelector = json.showInactiveCheckBoxSelector
            this.inactiveContentTypeListItemsSelector = json.inactiveContentTypeListItemsSelector;
            this.render();
        }

        render = () => {
            this.bindDom()            
            this.bindEvents();
            this.toggleInactive();
        }

        bindDom = () => {
            this.dom.showInactiveCheckBox = $(this.showInactiveCheckBoxSelector);
            this.dom.inactiveContentTypeListItems = $(this.inactiveContentTypeListItemsSelector);
        }

        bindEvents = () => {
            var self = this;
            this.dom.showInactiveCheckBox.on('click', function () {
                self.toggleInactive();
            });
        }

        toggleInactive = () => {      
            if (this.dom.showInactiveCheckBox.is(':checked'))
                this.dom.inactiveContentTypeListItems.show();
            else
                this.dom.inactiveContentTypeListItems.hide();
        }
	}
}