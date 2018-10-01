module Gartner.EventTrackService {

	export function getEventAndTrackByItemId(itemId: number): JQueryPromise<ReceiveAllResponse> {
		var url = "/EventTrack/GetEventAndTrackByItemId/" + itemId;
		
		return $.ajax({
			url,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getEventByEventId(eventId: number): JQueryPromise<GetEventAndTracksResponse> {
		return $.ajax({
			url: "/EventTrack/GetEventByEventId/" + eventId,
			cache: false,
			error: () => ErrorUtilities.showErrorMessage("Event Code Error", "Please pick an event from the list")
		});
	}

	export function getEmployeeFullNameByEmployeeId(employeeId: number): JQueryPromise<string> {
		//todo: remove method
		return EmployeeService.getEmployeeFullNameByEmployeeId(employeeId);
	}

	export function save(itemId: number, json: string): JQueryPromise<any> {
		ErrorUtilities.clearErrors();
		return $.ajax(<JQueryAjaxSettings>{
			url: "/EventTrack/AddOrUpdateFutureItem/" + itemId,
			data: json,
			type: "POST",
			contentType: "application/json",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
    }

	export function getEventsComboBoxDataSource(comboboxId: string) {
		return {
			transport: {
				read: {
					url: "/EventTrack/GetEvents",
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

	export function getSpeakersComboBoxDataSource() {
		return ServiceUtilities.getComboBoxDataSource("/Speakers/GetEmployees");
    }
    export function getSpeakersRolesDataSource() {
        return ServiceUtilities.getComboBoxDataSource("/Speakers/GetRoles");
    }

    export function getRoleDescriptionById(employeeId: number): JQueryPromise<string> {
        return EmployeeService.getSpeakerRoleDescription(employeeId);
    }

}