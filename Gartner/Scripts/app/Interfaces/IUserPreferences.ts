module Gartner {
	export interface IUserPreferences  {
		Id: number;
        UserId: number;
        UserDelegateViewModels: Array<Gartner.IEmployee>;
	}
} 