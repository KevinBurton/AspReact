module Gartner.BackupUserRoleService {

	export function fillBackupRoles() {
		$.ajax({
			url: "/Header/UpdateBackupRoleList",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
}