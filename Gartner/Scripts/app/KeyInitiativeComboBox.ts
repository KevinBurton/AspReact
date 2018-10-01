/// <reference path="../typings/handlebars/handlebars.d.ts" />

module Gartner {

    export class KeyInitiativeComboBox {

        private itemRootSelector: string = '.item-root';
        private wrapperSelector: string;
        private comboBoxSelector: string;
        private summarySelector: string;
        private summaryItemTemplateSelector: string;
        private modelName: string;
        private compiledSummaryItemTemplate = null;

        private dom = {
            wrapper: null,
            summary: null
        };

        onReady = (json: { wrapperSelector: string, comboBoxSelector: string, summarySelector: string, summaryItemTemplateSelector: string, modelName: string }) => {
            this.wrapperSelector = json.wrapperSelector;
            this.comboBoxSelector = json.comboBoxSelector;
            this.summarySelector = json.summarySelector;
            this.summaryItemTemplateSelector = json.summaryItemTemplateSelector;
            this.modelName = json.modelName;
            this.render();
        }

        render = () => {
            this.bindDom()
            this.bindEvents();
        }

        bindDom = () => {
            this.dom.wrapper = $(this.wrapperSelector);
            this.dom.summary = $(this.summarySelector);
        }

        bindEvents = () => {
            var self = this;
            this.dom.wrapper.on('click', '.add-button', function () {
                self.addToSummary();
            });
            this.dom.wrapper.on('click', '.outer-delete-button', function () {
                self.deleteFromSummary(this);
            });
        }

        summaryItemTemplate = (templateModel) => {
            if (this.compiledSummaryItemTemplate == null) {
                var templateHtml = $(this.summaryItemTemplateSelector).html();
                this.compiledSummaryItemTemplate = Handlebars.compile(templateHtml);
            }
            return this.compiledSummaryItemTemplate(templateModel);
        }

        addToSummary = () => {
            var self = this;
            var comboBoxData = $(this.comboBoxSelector).data('kendoComboBox');
            if (!$.isNumeric(comboBoxData.value())) {
                return;
            }
            // Prevent duplicates from being added
            var idToAdd = comboBoxData.value();
            var duplicate = this.dom.summary.find('.uneditable-text[data-id=' + idToAdd + ']');
            if (duplicate.length > 0) {                
                toastr.error('Cannot add duplicate Key Initiatives');
                return;
            }
            this.showLoading(true);
            KeyInitiativeService.getKeyInitiativeById(Number(comboBoxData.value()))
                .done(response => {
                    var itemToAdd = {
                        ModelName: self.modelName,
                        Id: response['Id'],
                        Name: response['Name'],
                        InnerItems: response['Phases'],
                        IsActive: response['IsActive']
                    };
                    $(this.summarySelector).append(this.summaryItemTemplate(itemToAdd));
                    comboBoxData.text('');                    
                }).always(() => {
                    self.showLoading(false);
                });
        }

        deleteFromSummary = (button) => {            
            $(button).closest(this.itemRootSelector).remove()
        }

        showLoading = (show: boolean = true) => {
            var container = this.dom.wrapper.closest('.portlet');

            if (show) {
                var position = container.position();
                var top = position.top + (container.height() / 2);
                var left = position.left + (container.width() / 2) - 16; //16 for gif loader size
                var loadingDisplay = $("<span/>")
                    .addClass("panel-loading")
                    .css("top", top + "px")
                    .css("left", left + "px")
                    .fadeIn();

                container.append(loadingDisplay);

                var largerLoading = container.hasClass("larger-loading");

                var width = container.width();
                var height = container.height();
                if (largerLoading) {
                    width += 30;
                    height += 30;
                }

                var grayedOut = $("<div>")
                    .addClass("panel-loading-bg")
                    .css("top", position.top + "px")
                    .css("left", position.left + "px")
                    .css("width", width + "px")
                    .css("height", height + "px")
                    .fadeIn();

                container.append(grayedOut);

            } else {
                container.find(".panel-loading").remove();
                container.find(".panel-loading-bg").remove();
            }
        }
	}
}