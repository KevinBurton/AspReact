/// <reference path="../../gartner.ts" />

interface IUserInformationParams {
	userFullName: string;
	userId: number;
	isAdmin: boolean;
	isTeamManager: boolean;
	userRoles: Array<string>;
}

module Gartner {

	export class UserInformation
	{
		onReady(json: IUserInformationParams) {

			Gartner.loggedInUserInformation = new LoggedInUserInformation(
				json.userFullName,
				json.userId,
				json.userRoles,
				json.isAdmin,
				json.isTeamManager
			);
		}
	}
	
} 