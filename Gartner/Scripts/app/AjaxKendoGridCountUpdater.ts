module Gartner {
  

    export function updateCount(gridId: string, eventId: number, currentEmployeeCode: number,  countClass: string) {
		updateApprovalCount();
        var $countElement = $("." + countClass);

        var url;


        if (gridId === "InitialApprovalGrid") {
            url = "/EventTrack/GetGridDataSource/?eventId=";
        } else {
            url = "/EventTrack/GetFinalGridDataSource/?eventId=";
        }

        var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: url + eventId,
                        type: "post",
                        dataType: "json"
                    }
                }
        });

        dataSource.fetch(function () {
            var gridRows = dataSource.data().map(x => x);

            if (gridRows.length === 0) {
                $countElement.html((0).toString());
            } else {
                var itemsNeedingApprovalCount = gridRows.filter((row) => {
                    return row.ApprovalIndicators.NeedsChairApprovalFromCurrentEmployee || row.ApprovalIndicators.NeedsEventManagerApprovalFromCurrentEmployee;
                }).length;

                $countElement.html(itemsNeedingApprovalCount.toString());
            }
        });

       
	}

	function updateApprovalCount() {
		var approvalCountAjaxDisplays = <AjaxDisplay[]>Gartner.allInstancesOfUniqueId("ApprovalCount");
		if (approvalCountAjaxDisplays.length > 0) {
			approvalCountAjaxDisplays[0].refresh();	
		}
    }
} 