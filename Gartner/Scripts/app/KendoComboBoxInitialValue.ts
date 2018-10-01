/// <reference path="../typings/jquery/jquery.d.ts" />

interface KendoComboBoxInitialValueParams {
	comboBoxId: string;
	employeeId: number;
	employeeDisplayName: string;
}

module Gartner {
	
	export class KendoComboBoxInitialValue {
		
		onReady(json: KendoComboBoxInitialValueParams) {
			setTimeout(() => {
				var comboBoxId = json.comboBoxId;
				var comboBoxValue = $("#" + comboBoxId);
				var comboBoxInput = $("[name='" + comboBoxId + "_input']");

				comboBoxValue.val(json.employeeId.toString(10));
				comboBoxValue.trigger("change");
				comboBoxInput.val(json.employeeDisplayName);

				comboBoxInput.on("focusout", () => {
					if (comboBoxInput.val() === json.employeeDisplayName) {
						comboBoxValue.val(json.employeeId.toString(10));
						comboBoxValue.trigger("change");
					}
				});
			}, 10);
		}

	}

} 