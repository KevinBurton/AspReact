module Gartner.AuthorService {
	export function getEmployeeDetailByEmployeeId(employeeId: number): JQueryPromise<string> {
		return $.ajax({
			url: "/Speakers/GetEmployeeFullNameById?employeeId=" + employeeId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
} 