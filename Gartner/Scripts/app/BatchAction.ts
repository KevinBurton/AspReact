module Gartner {
	
	export enum ApprovalRole {
		ConferenceChair = 1,
		EventManager = 2
	}
	export enum ApprovalAction {
		Approved = 1,
		Declined = 2
	}
	export enum ItemStatusEnum {
		PendingInitialApproval = 2,
		PendingFinalApproval = 3
	}
	export class BatchAction {
		 gridAction : GridAction;
		
		onReady(json: { gridName?: string; }) {
			this.gridAction = new GridAction();
				
			var ccDeclineSelector = "#batchDeclineAsCC";
			var ccApproveSelector = "#batchApproveAsCC";
			var eventPmDeclineSelector = "#batchDeclineAsEventPM";
			var eventPmApproveSelector = "#batchApproveAsEventPM";
			
			var selectAllSelector = "#selectAll";
			$("body").off("click", ccDeclineSelector).on("click", ccDeclineSelector, this.onCcDecline);
			$("body").off("click", ccApproveSelector).on("click", ccApproveSelector, this.onCcApprove);
			$("body").off("click", eventPmApproveSelector).on("click", eventPmApproveSelector, this.onEventPmApprove);
			$("body").off("click", eventPmDeclineSelector).on("click", eventPmDeclineSelector, this.onEventPmDecline);
			$("body").off("click", selectAllSelector).on("click", selectAllSelector, this.selectAllRow);
		}

		

		onCcDecline = (event: JQueryEventObject) => {
			
			event.preventDefault();
			var items = this.getSelectedItem(".btn-link.mrr.conference-chair-approval-decline");
			this.submitData(items, ApprovalRole.ConferenceChair, ApprovalAction.Declined);
			return true;
		}
		onCcApprove = (event: JQueryEventObject) => {
			event.preventDefault();
			var items = this.getSelectedItem(".btn-link.mrr.conference-chair-approval");
			this.submitData(items, ApprovalRole.ConferenceChair, ApprovalAction.Approved);
			return true;
		}
		onEventPmApprove = (event: JQueryEventObject) => {
			event.preventDefault();
			var items = this.getSelectedItem(".btn-link.mrr.event-manager-approval");
			this.submitData(items, ApprovalRole.EventManager, ApprovalAction.Approved);
			return true;
		}
		onEventPmDecline = (event: JQueryEventObject) => {
			event.preventDefault();
			var items = this.getSelectedItem(".btn-link.mrr.event-manager-approval-decline");
			this.submitData(items, ApprovalRole.EventManager, ApprovalAction.Declined);
			return true;
		}
		
		submitData = (itemIds: any, role: ApprovalRole, action: ApprovalAction) => {
			
			var itemStatus;
			var gridName = this.getGridName();
			if (itemIds.length === 0) return;
			if (gridName === "InitialApprovalGrid") {
				itemStatus = ItemStatusEnum.PendingInitialApproval;
			} else {
				itemStatus = ItemStatusEnum.PendingFinalApproval;
			}
			
			$.ajax({
				type: "POST",
				data: {
					"itemIds": itemIds,
					"status": itemStatus,
					"role": role,
					"action" : action
				},
				url: '/ApprovalDashboard/BatchApprovalDecline',
				success: (response) => {
                    if (response.exceptionMessage) {
                        toastr.error(response.exceptionMessage, "Approval Dashboard");
                    } else {
                        if (response.successMessage) {
                            this.gridAction.showOptionalSuccessMessage(response);
                        }
                    }
					setTimeout(() => {
						$("#" + gridName).data("kendoGrid").dataSource.read();
					}, 10);
                },
                error: () => {
                    this.gridAction.showGeneralError();
                },
                complete: () => {
                    this.gridAction.showLoadingIndicatorInGrid(false);
                }
				
			});
			
		}

		getGridName = (): string => {
			var tabName = $(".tab-pane.fade.active").attr("id");

			if (tabName === "initial") {
				return "InitialApprovalGrid";
			} 

			return "FinalApprovalGrid";
			
		}

		getSelectedItem = (btnSelector: string): any => {
			var items = [];
			var unrelatedItem = false;
			var gridName = this.getGridName();

			var selector = "#" + gridName + " tbody";
			
			$(selector).find('tr').each( 
				function () {
					var selected = $(this).find('#batchAction').is(':checked');
					if (selected) {
						if ($(this).has("td " + btnSelector).length > 0 ) {
							var id = $(this).find("td "+ btnSelector).attr("data-id");
							items.push(id);
						} else {
							unrelatedItem = true;
						}
					}
				}
			);
			if (unrelatedItem) {
                toastr.info("You have selected sessions that already have a decision on them. Please check your selections and try again.");
				return [];
			}
			return items;
		}

		selectAllRow = () => {
			var gridName = this.getGridName();
			var selector = "#" + gridName + " tbody";
			var state = $("#" + gridName + " #selectAll").is(':checked');
			$(selector).find('tr').each(  function () {
				var selected = $(this).find('#batchAction').is(':checked');
				if (selected !== state) {
					$(this).find('#batchAction').prop('checked', state);
				}
			});
			return true;
		}
		
	}
} 