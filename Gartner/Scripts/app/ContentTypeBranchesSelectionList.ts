module Gartner {
    
    /**
     * A list of Content Types Branches for selection.
     */
    export class ContentTypeBranchesSelectionList {

        private showInactiveCheckBoxSelector: string;
        private inactiveBranchListItemsSelector: string;
        private visibleBranchCheckBoxesSelector: string;

        private dom = {
            showInactiveCheckBox: null,
            inactiveBranchListItems: null
        };

        onReady = (json: { showInactiveCheckBoxSelector: string, inactiveBranchListItemsSelector: string, visibleBranchCheckBoxesSelector: string }) => {
            this.load(json);
        }

        load = (json: { showInactiveCheckBoxSelector: string, inactiveBranchListItemsSelector: string, visibleBranchCheckBoxesSelector: string }) => {
            this.showInactiveCheckBoxSelector = json.showInactiveCheckBoxSelector;
            this.inactiveBranchListItemsSelector = json.inactiveBranchListItemsSelector;
            this.visibleBranchCheckBoxesSelector = json.visibleBranchCheckBoxesSelector;
            this.render();
        }

        render = () => {
            this.bindDom()            
            this.bindEvents();
            this.toggleInactive();
        }

        bindDom = () => {
            this.dom.showInactiveCheckBox = $(this.showInactiveCheckBoxSelector);
            this.dom.inactiveBranchListItems = $(this.inactiveBranchListItemsSelector);
        }

        bindEvents = () => {
            var self = this;
            this.dom.showInactiveCheckBox.on('click', function () {
                self.toggleInactive();
            });
        }

        toggleInactive = () => {     
            if (this.dom.showInactiveCheckBox.is(':checked')) {
                this.dom.inactiveBranchListItems.show();
            } else {
                this.dom.inactiveBranchListItems.hide();
            }
        }
	}
}