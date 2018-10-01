module Gartner {

    var exportFlg = false;

    export function exportHiddenColumnToExcel(e) {

        if (!exportFlg) {
            e.preventDefault();
            e.sender.showColumn(2);
            e.sender.showColumn(4);
            e.sender.showColumn("SessionCategoryDescription");
            e.sender.hideColumn("SessionCategory");
            e.sender.showColumn("NewnessDescription");
            e.sender.hideColumn("Newness");
            e.sender.showColumn("ResearchElementDescription");
            e.sender.hideColumn("ResearchElement");
            e.sender.showColumn("IndustryDescription");
            e.sender.hideColumn("Industry");
            e.sender.showColumn("ContentFocusDescription");
            e.sender.hideColumn("ContentFocus");
            e.sender.showColumn("ContentMaturityDescription");
            e.sender.hideColumn("ContentMaturity");
            e.sender.showColumn("ContentAspectDescription");
            e.sender.hideColumn("ContentAspect");
            e.sender.showColumn("NeedsLivePollingDescription");
            e.sender.hideColumn("NeedsLivePolling");
            e.sender.hideColumn("NoContent");
            exportFlg = true;
            setTimeout(() => {
                e.sender.saveAsExcel();
            });
        } else {
            e.sender.hideColumn(2);
            e.sender.hideColumn(4);
            e.sender.hideColumn("SessionCategoryDescription");
            e.sender.showColumn("SessionCategory");
            e.sender.hideColumn("NewnessDescription");
            e.sender.showColumn("Newness");
            e.sender.hideColumn("ResearchElementDescription");
            e.sender.showColumn("ResearchElement");         
            e.sender.hideColumn("IndustryDescription");
            e.sender.showColumn("Industry");
            e.sender.hideColumn("ContentFocusDescription");
            e.sender.showColumn("ContentFocus");
            e.sender.hideColumn("ContentMaturityDescription");
            e.sender.showColumn("ContentMaturity");
            e.sender.hideColumn("ContentAspectDescription");
            e.sender.showColumn("ContentAspect");
            e.sender.hideColumn("NeedsLivePollingDescription");
            e.sender.showColumn("NeedsLivePolling");
            e.sender.showColumn("NoContent");
            exportFlg = false;
        }
    }

    export function exportApprovalDashboardHiddenColumnToExcel(e) {

        if (!exportFlg) {
            e.preventDefault();
            e.sender.showColumn(0);
            e.sender.hideColumn(1);
            e.sender.hideColumn(2);
            e.sender.hideColumn(3);
            e.sender.showColumn("Track.TrackName");
            e.sender.hideColumn("Track");
			e.sender.showColumn("SessionCategoryDescription");
            e.sender.hideColumn("SessionCategory");
            exportFlg = true;
            setTimeout(function () {
                e.sender.saveAsExcel();
            });
        } else {
            e.sender.hideColumn(0);
            e.sender.showColumn(1);
            e.sender.showColumn(2);
            e.sender.showColumn(3);
            e.sender.hideColumn("Track.TrackName");
            e.sender.showColumn("Track");
			e.sender.hideColumn("SessionCategoryDescription");
            e.sender.showColumn("SessionCategory");
            exportFlg = false;
        }

    }

    export function exportAllAgendaData(e) {
        const sheet = e.workbook.sheets[0];

        for (let rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
            const row = sheet.rows[rowIndex];

            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {

                row.cells[cellIndex].wrap = true;

                // Switch to 'verticalAlign' above Kendo 2015.3
                row.cells[cellIndex].vAlign = 'center';
                
                const rowValue = row.cells[cellIndex].value;

                if (typeof rowValue !== 'string') {
                    var total = '';

                    if (rowValue.length > 0) {
                        total = rowValue.map((value: any, index: number) => {
                            let internal = '';

                            if (value.IsActive === true) {
                                internal = value.Name;
                            } else {
                                internal = `${value.Name} (Inactive)`;
                            }

                            if (index + 1 !== rowValue.length) {
                                internal = internal.concat('; ');
                            }

                            return internal;
                        }).reduce((previousValue: string, currentValue: string) => {
                            return previousValue.concat(currentValue);
                        });
                    }

                    row.cells[cellIndex].value = total;
                }
            }
        }
    }
} 