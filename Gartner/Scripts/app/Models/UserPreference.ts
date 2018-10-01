module Gartner {
	export class UserPreference implements IUserPreferences {
		Id: number;
		UserId: number;
        UserDelegateViewModels: Array<IEmployee>;
	}
} 