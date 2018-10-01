/// <reference path="../typings/handlebars/handlebars.d.ts" />

module Gartner {

    export class EmployeeComboBox {
                
        private wrapperSelector: string;
        private employeeComboBoxSelector: string;
        private employeeSummarySelector: string;
        private employeeSummaryItemTemplateSelector: string;
        private modelName: string;
        private selectMultiple: boolean;
        private compiledEmployeeSummaryItemTemplate = null;
        private dom = {
            wrapper: null,
            employeeSummary: null
        };

        onReady = (json: { wrapperSelector: string, employeeComboBoxSelector: string, employeeSummarySelector: string, employeeSummaryItemTemplateSelector: string, modelName: string, selectMultiple: boolean }) => {
            this.wrapperSelector = json.wrapperSelector;
            this.employeeComboBoxSelector = json.employeeComboBoxSelector;
            this.employeeSummarySelector = json.employeeSummarySelector;
            this.employeeSummaryItemTemplateSelector = json.employeeSummaryItemTemplateSelector;
            this.modelName = json.modelName;
            this.selectMultiple = json.selectMultiple;
            this.render();
        }

        render = () => {
            this.bindDom()
            this.bindEvents();
            this.toggleSummary();
        }

        bindDom = () => {
            this.dom.wrapper = $(this.wrapperSelector);
            this.dom.employeeSummary = $(this.employeeSummarySelector);
        }

        bindEvents = () => {
            var self = this;
            this.dom.wrapper.on('click', '.add-button', function () {
                self.addEmployeeToSummary();
            });
            this.dom.wrapper.on('click', '.delete-button', function () {
                self.deleteEmployeeFromSummary(this);
            });
        }

        employeeSummaryItemTemplate = (templateModel) => {
            if (this.compiledEmployeeSummaryItemTemplate == null) {
                var templateHtml = $(this.employeeSummaryItemTemplateSelector).html();
                this.compiledEmployeeSummaryItemTemplate = Handlebars.compile(templateHtml);
            }
            return this.compiledEmployeeSummaryItemTemplate(templateModel);
        }

        addEmployeeToSummary = () => {
            var self = this;
            var employeeComboBoxData = $(this.employeeComboBoxSelector).data('kendoComboBox');
            if (!$.isNumeric(employeeComboBoxData.value())) {
                return;
            }
            var modelName = this.modelName;

            // Prevent duplicates from being added
            var idToAdd = employeeComboBoxData.value();
            var duplicate = this.dom.employeeSummary.find('tr[data-id=' + idToAdd + ']');
            if (duplicate.length > 0) {
                toastr.error('Cannot add duplicate Employee');
                return;
            }

            if (this.selectMultiple == false) {
                var employeeCount = this.dom.employeeSummary.find('table > tbody > tr').length;
                if (employeeCount > 0) {
                    this.dom.employeeSummary.find('table > tbody').empty();
                }
            }            
            var employeeToAdd = {
                ModelName: modelName,
                Id: employeeComboBoxData.value(),
                Name: employeeComboBoxData.text()
            };            
            this.dom.employeeSummary.find('table > tbody').append(this.employeeSummaryItemTemplate(employeeToAdd));
            employeeComboBoxData.text('');
            this.toggleSummary();
        }

        deleteEmployeeFromSummary = (deleteButton) => {            
            var self = this;
            $(deleteButton).parents('tr').remove();
            this.toggleSummary();
        }

        toggleSummary = () => {
            var employeeCount = this.dom.employeeSummary.find('table > tbody > tr').length;
            if (employeeCount == 0) {
                this.dom.employeeSummary.hide();
            } else {
                this.dom.employeeSummary.show();
            }
        }
	}
}