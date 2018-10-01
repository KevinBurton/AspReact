/// <reference path="../typings/handlebars/handlebars.d.ts" />

module Gartner {

    export class EditableAccordionList {

        private itemRootSelector: string = '.item-root';
        private editorSelector: string = ".inline-editor";
        private uneditableSelector: string = ".inline-uneditable";
        private editableSelector: string = ".inline-editable";
        private uneditableTextSelector: string = ".uneditable-text";
        private outerAddTextBoxSelector: string = ".outer-add-textbox";
        private outerAddButtonSelector: string = ".outer-add-button";
        private outerEditButtonSelector: string = ".outer-edit-button";
        private outerDeleteButtonSelector: string = ".outer-delete-button";
        private outerSaveButtonSelector: string = ".outer-save-button";
        private outerCancelButtonSelector: string = ".outer-cancel-button";
        private outerTemplateSelector: string = "#editableAccordionTemplate";
        private innerWrapperSelector: string = ".inner-wrapper";
        private innerAddTextBoxSelector: string = ".inner-add-textbox";
        private innerAddButtonSelector: string = ".inner-add-button";
        private innerEditButtonSelector: string = ".inner-edit-button";
        private innerDeleteButtonSelector: string = ".inner-delete-button";
        private innerSaveButtonSelector: string = ".inner-save-button";
        private innerCancelButtonSelector: string = ".inner-cancel-button";        
        private innerTemplateSelector: string = "#editableAccordionItemTemplate";
        private outerWrapperSelector: string;
        private outerModelName: string;
        private innerModelName: string;
        private outerPlaceholderText: string;
        private innerPlaceholderText: string;
        private compiledOuterTemplate = null;
        private compiledInnerTemplate = null;

        private dom = {
            outerWrapper: null
        };

        onReady = (json: { outerWrapperSelector: string, outerModelName: string, innerModelName: string, outerPlaceholderText: string, innerPlaceholderText: string }) => {
            this.outerWrapperSelector = json.outerWrapperSelector;
            this.outerModelName = json.outerModelName;
            this.innerModelName = json.innerModelName;
            this.outerPlaceholderText = json.outerPlaceholderText;
            this.innerPlaceholderText = json.innerPlaceholderText;
            this.render();
        };

        public render = () => {
            this.bindDom()
            this.bindEvents();     
        }

        bindDom = () => {
            this.dom.outerWrapper = $(this.outerWrapperSelector);
        }

        bindEvents = () => {
            var self = this;
            $('#wrapper').on('click', this.outerAddButtonSelector, function () {
                self.addAccordion(this);
            });
            this.dom.outerWrapper.on('click', this.outerEditButtonSelector, function () {
                self.edit(this);
            });
            this.dom.outerWrapper.on('click', this.outerDeleteButtonSelector, function () {
                self.deleteAccordion(this);
            });            
            this.dom.outerWrapper.on('click', this.outerSaveButtonSelector, function () {
                self.save(this);
            });
            this.dom.outerWrapper.on('click', this.outerCancelButtonSelector, function () {
                self.cancel(this);
            });
            this.dom.outerWrapper.on('click', this.innerAddButtonSelector, function () {
                self.addAccordionItem(this);
            });
            this.dom.outerWrapper.on('click', this.innerEditButtonSelector, function () {
                self.edit(this);
            });
            this.dom.outerWrapper.on('click', this.innerDeleteButtonSelector, function () {
                self.deleteAccordionItem(this);
            });
            this.dom.outerWrapper.on('click', this.innerSaveButtonSelector, function () {
                self.save(this);
            });
            this.dom.outerWrapper.on('click', this.innerCancelButtonSelector, function () {
                self.cancel(this);
            });        
        }

        outerTemplate = (templateModel) => {
            if (this.compiledOuterTemplate == null) {
                var templateHtml = $(this.outerTemplateSelector).html();
                this.compiledOuterTemplate = Handlebars.compile(templateHtml);
            }
            return this.compiledOuterTemplate(templateModel);
        }

        innerTemplate = (templateModel) => {
            if (this.compiledInnerTemplate == null) {
                var templateHtml = $(this.innerTemplateSelector).html();
                this.compiledInnerTemplate = Handlebars.compile(templateHtml);
            }
            return this.compiledInnerTemplate(templateModel);
        }

        edit = (button) => {
            $(this.uneditableSelector).show();
            $(this.editableSelector).hide();            
            var uneditable = $(button).closest(this.uneditableSelector);
            uneditable.hide();
            uneditable.next(this.editableSelector).show();            
        }

        deleteAccordion = (button) => {            
            var self = this;
            $(button).closest(this.itemRootSelector).remove();
        }

        deleteAccordionItem = (button) => {
            var self = this;
            $(button).closest(this.itemRootSelector).remove();
        }

        cancel = (button) => {
            var editable = $(button).closest(this.editableSelector);
            var uneditable = editable.prev(this.uneditableSelector);
            var textBox = editable.find('input');
            var unchangedText = textBox.attr('data-name');
            textBox.val(unchangedText);
            uneditable.show();
            editable.hide();
        }

        save = (button) => {            
            var editable = $(button).closest(this.editableSelector);
            var uneditable = editable.prev(this.uneditableSelector);
            var textBox = editable.find('input');
            var changedText = textBox.val();
            textBox.attr('data-name', changedText);
            textBox.val(changedText);
            uneditable.find(this.uneditableTextSelector).html(changedText);
            uneditable.show();
            editable.hide();
        }
        
        addAccordion = (button) => {
            var self = this;
            var newText = $(this.outerAddTextBoxSelector).val();
            if (newText == '')
                return;
            $(this.outerAddTextBoxSelector).val('');
            var timestamp = Date.now();
            var outerViewModel = {
                Timestamp: timestamp,
                Name: newText,
                ModelName: this.outerModelName,
                Id: 0,
                PlaceholderText: this.outerPlaceholderText,
                InnerPlaceholderText: this.innerPlaceholderText
            };
            this.dom.outerWrapper.append(this.outerTemplate(outerViewModel));
        }

        addAccordionItem = (button) => {
            var self = this;
            var newText = $(button).closest('.input-group').children(this.innerAddTextBoxSelector).val();
            if (newText == '')
                return;
            $(button).closest('.input-group').children(this.innerAddTextBoxSelector).val('');
            var timestamp = Date.now();
            var innerViewModel = {
                Timestamp: timestamp,
                Name: newText,
                ModelName: this.innerModelName,
                Id: 0,
                PlaceholderText: this.innerPlaceholderText,
            };
            $(button).closest(this.itemRootSelector).find(this.innerWrapperSelector).append(this.innerTemplate(innerViewModel));
        }
	}
}