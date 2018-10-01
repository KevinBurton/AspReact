/// <reference path="../../typings/jquery/jquery.d.ts" />
module Gartner.DocumentInformationService
{
	export function getDocumentInformationByItemId(itemId: number): JQueryPromise<IDocumentInformation> {
		return $.ajax({
			url: "/DocumentInformation/GetByItemId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function save(json: string): JQueryPromise<any> {
		ErrorUtilities.clearErrors();
		return $.ajax(<JQueryAjaxSettings>{
			url: "/DocumentInformation/Save",
			data: json,
			type: "POST",
			contentType: "application/json",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});	
	}

	function getDataSourceData (data : any)  {
		if (data.filter && data.filter.filters.length > 0) {
			return {
				text: data.filter.filters[0].value
			};
		} else {
			return {
				text: ""
			};
		}
	}
	export function getAuthorsComboBoxDataSource(comboboxId: string) {
		return {
			transport: {
				read: {
					url: "/Authors/GetEmployees",
					data: () => {
						var comboBox: any = kendo.ui.ComboBox;
						return comboBox.requestData($("#" + comboboxId));
					}
				},
				prefix: ""
			},
			serverFiltering: true,
			filter: [],
			schema: {
				errors: "Errors"
			}
		};
	}
} 