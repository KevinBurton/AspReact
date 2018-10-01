module Gartner {
    export class BasicInformationEdit {
        previousSessionCategoryId = 0;
        previousLanguage = "en";

        onReady() {

            $("body")
                .off("change", "#SessionCategoryId")
                .on("focus", "#SessionCategoryId", (event: JQueryEventObject) => {
                    this.previousSessionCategoryId = $("#SessionCategoryId").val();
                })
                .on("change", "#SessionCategoryId", (event: JQueryEventObject) => {


                    if ($("#SessionCategoryId").val() === "3")
                        $("#NoContentCreatedCheckBox").prop("checked", true);
                    if (this.previousSessionCategoryId.toString() === "3")
                        $("#NoContentCreatedCheckBox").prop("checked", false);

                    this.previousSessionCategoryId = $("#SessionCategoryId").val();
                });

            $("body")
                .off("change", "#LanguageId")
                .on("focus", "#LanguageId", (event: JQueryEventObject) => {
                    this.previousLanguage = $("#LanguageId").val();
                })
                .on("change", "#LanguageId", (event: JQueryEventObject) => {
                    if ($("#LanguageId").val() === "en" && $("#NeedTranslationField").val() === true) {
                        $("#NeedTranslation").show();
                        $('#NeedTranslationSection').show();
                    }
                    else {
                        $("#NeedTranslation").hide();
                        $('#NeedTranslationSection').hide();
                    }
                    this.previousLanguage = $("#LanguageId").val();
                });

            $("body")
                .on("change", "#NoContentCreatedCheckBox", (event: JQueryEventObject) => {
                    if ($("#NoContentCreatedCheckBox").is(':checked')) {
                        $("#PublishContentDropDown").prop('selectedIndex', 0);
                        $("#PublishContentDropDownHidden").hide();
                    } else {

                        if ($("#CanEditPublishContent").val() === "True") {
                            if ($("#SessionCategoryId").val() === '4') {
                                $("#PublishContentDropDown").prop('selectedIndex', 2);
                                $("#PublishContentDropDownHidden").show();
                                $("#PublishContentDropDownHidden").css('display:block');
                            } else {
                                $("#PublishContentDropDown").prop('selectedIndex', 1);
                                $("#PublishContentDropDownHidden").css('display:block');
                                $("#PublishContentDropDownHidden").show();
                            }
                        }
                    }
                });
        }
    }
}