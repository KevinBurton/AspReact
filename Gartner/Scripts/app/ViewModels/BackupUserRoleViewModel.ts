module Gartner {

	export class BackupUserRole {
		
		onReady() {
			BackupUserRoleService.fillBackupRoles();
		}
	}
}