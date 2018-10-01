﻿module Gartner {

    export function handleGridEditCondition(event) {

        if (event.model.Status === "Complete") {
            $("#EventItemsGrid").data("kendoGrid").closeCell();
            return;
        }

        var grid = event.sender;
        var columnToChange = grid.columns[event.container.index()].field;
        if (columnToChange === "SessionCategory" && !event.model.CanEditSessionCategory) {
            $("#EventItemsGrid").data("kendoGrid").closeCell();
        }
    }
} 