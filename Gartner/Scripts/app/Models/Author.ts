/// <reference path="../utilities/enums.ts" />

module Gartner.Models{
	export class Author implements IAuthor {
		Id: number;
		EmployeeId: number;
		EmployeeName: string;
		AuthorType: number;
		public IsPrimaryAuthor = ko.observable<boolean>(false);
		ObjectState: ObjectStateEnum;
		public AuthorOrderObservable = ko.observable<number>();
		private _authorOrder: number;
		
		get AuthorOrder(): number {
			return this._authorOrder;
		}
		set AuthorOrder(authorOrder:number) {
			this._authorOrder = authorOrder;
			this.AuthorOrderObservable(authorOrder);
		}

		constructor(id: number, name: string, employeeId: number, itemAuthorTypeId: number, objectState: ObjectStateEnum, authorOrder: number);
		constructor(id: number, name: string, employeeId: number, itemAuthorTypeId: number, objectState: ObjectStateEnum, authorOrder: number) {
			this.Id = id;
			this.EmployeeName = name;
			this.EmployeeId = employeeId;
			this.AuthorType = itemAuthorTypeId;
			this.IsPrimaryAuthor((itemAuthorTypeId === 1) || false);
			this.ObjectState = objectState;
			this.IsPrimaryAuthor.subscribe(this.changeAuthorType);
			this.IsPrimaryAuthor.subscribe(this.changeState);
			this.AuthorOrderObservable.subscribe(this.authorOrderChanged);
			this.AuthorOrderObservable(authorOrder);
			this.AuthorOrderObservable.subscribe(this.changeState);
		}
		authorOrderChanged = (order: number) => {
			if(order !== this._authorOrder)
				this._authorOrder = order;
		}

		isAuthorWithName = (name: any) => {
			return this.EmployeeName === name;
		}

		isAuthorWithEmployeeId = (employeeId: any) => {
			return (this.EmployeeId === employeeId );
		}
		
		changeAuthorType = (primary: boolean) => {
			if (primary === true) {
				this.AuthorType = AuthorType.Primary;
				this.AuthorOrderObservable(1);
			}
			else
			{
				this.AuthorType = AuthorType.CoAuthor;
			}
		}

		changeState = () => {
			if (this.ObjectState !== ObjectStateEnum.Added) {
				this.ObjectState = ObjectStateEnum.Modified;
			}
		}
		toJSON = () => {
			return {
					Id: this.Id,
					EmployeeId: this.EmployeeId || null,
					EmployeeName: this.EmployeeName,
					AuthorType: this.AuthorType,
					ObjectState: this.ObjectState,
					AuthorOrder: this.AuthorOrder
				};
		}		
	}
} 