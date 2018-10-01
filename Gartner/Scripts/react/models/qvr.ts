export interface ReviewersCollection {
	itemReviewers: Reviewer[];
	showQvr: boolean;
}

export interface Reviewer {
	id: number;
	employeeId: number;
	employeeName: string;
	vendor: string;
	reviewerTypeId: number;
	qvr?: Qvr;
	isComplete: boolean;
}

export interface Qvr {
	rating?: number;
	reasonId?: number;
	comment?: string;
}

export interface Modal {
	isOpen: boolean;
	isSaving: boolean;
	currentReviewer?: Reviewer;
	reasons: Reason[];
	hasNoPeerReviewProvided: boolean;
	rating?: number;
	comment?: string;
	reasonId?: number;
}

export interface Reason {
	Id: number;
	Name: string;
}
