module Gartner {
	
	export class KendoComboBoxMirrorForForm {
		
		onReady(json: { formId: string; comboBoxId: string; transformTo: string }) {
			var comboBoxTemp = $("#" + json.comboBoxId);

			var hiddenFieldForRealComboBoxValue = $("<input>")
				.attr("type", "hidden")
				.attr("id", json.transformTo)
				.attr("name", json.transformTo)
				.val(comboBoxTemp.val());

			$("#" + json.formId).append(hiddenFieldForRealComboBoxValue);
			comboBoxTemp.on("change", () => {
				hiddenFieldForRealComboBoxValue.val(comboBoxTemp.val());
			});
		}
	}
} 