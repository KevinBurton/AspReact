module Gartner {

    export interface IAuthor {
        Id: number;
        EmployeeId: number;
        EmployeeName: string;
        AuthorType: number;
        ObjectState: ObjectStateEnum;
        AuthorOrder: number;
    }
}