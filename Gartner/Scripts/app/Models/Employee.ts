module Gartner.Models {
	export class Employee implements  IEmployee {
		Id: number;
		EmployeeId: number;
		EmployeeName: string;
		NonEmployeeName: string;
		CreatedTimeUtc: string;
		CreatedTimeIso: string;
		CreatedByEmployeeId: number;
		ObjectState: ObjectStateEnum;
		TypeId: number;
		constructor(id: number, name: string, employeeId: number, typeId?: number,
			nonEmployeeName?: string, createdTimeUtc?: string, createdByEmployeeId?: number,
			objectState? : ObjectStateEnum);
		constructor(id: number, name: string, employeeId: number, typeId?: number,
			nonEmployeeName?: string, createdTimeUtc?: string, createdByEmployeeId?: number,
			objectState?: ObjectStateEnum) {
			this.Id = id;
			this.EmployeeId = employeeId;
			this.EmployeeName = name;
			this.NonEmployeeName = nonEmployeeName;
			this.CreatedTimeUtc = createdTimeUtc;
			this.CreatedByEmployeeId = createdByEmployeeId;
			this.ObjectState = objectState;
			this.TypeId = typeId;
		}

		isEmployeeWithEmployeeId = (employeeId: any) => {
			return (this.EmployeeId === employeeId);
		}

		toJson(): IEmployee {
			return <IEmployee>{
				Id: this.Id,
				EmployeeId: this.EmployeeId,
				EmployeeName: this.EmployeeName,
				NonEmployeeName: this.NonEmployeeName,
				CreatedTimeUtc: this.CreatedTimeUtc,
				CreatedTimeIso: this.CreatedTimeIso,
				CreatedByEmployeeId: this.CreatedByEmployeeId,
				ObjectState: this.ObjectState,
				TypeId : this.TypeId
			};
		}
	}

} 