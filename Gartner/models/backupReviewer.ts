export interface Backup {
	name: string;
	emailAddress: string;
}

export interface BackupReviewersDictionary {
	[employeeId: number]: Backup[];
}
