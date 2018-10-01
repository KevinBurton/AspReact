module Gartner.EmployeeService {

	export function getEmployeeFullNameByEmployeeId(employeeId: number): JQueryPromise<string> {
		return $.ajax({
			url: "/Speakers/GetEmployeeFullNameById?employeeId=" + employeeId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
    }

    export function getSpeakerRoleDescription(roleId: number): JQueryPromise<string> {
        return $.ajax({
            url: "/Speakers/GetRoleDescription?roleId=" + roleId,
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }

} 