module Gartner {
	export interface IEmployee {
		Id: number;
		EmployeeId: number;
		EmployeeName: string;
		NonEmployeeName: string;
		CreatedTimeUtc: string;
		CreatedTimeIso?: string;
		CreatedByEmployeeId: number;
		ObjectState: ObjectStateEnum;
		TypeId : number;
	}
} 