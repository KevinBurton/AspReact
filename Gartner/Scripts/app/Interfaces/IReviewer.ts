module Gartner {

	export interface IReviewer {
		ReviewCompleted: boolean;
		EmployeeId: number;
		EmployeeName: string;
		ReviewerType?: number;
		ReviewerTypeDescription?: string;
		Reason?: string;
	}

} 