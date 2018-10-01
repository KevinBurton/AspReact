/// <reference path="../utilities/enums.ts" />
module Gartner {

	export class Reviewer implements IReviewer {
		ReviewCompleted: boolean;
		EmployeeId: number;
		EmployeeName: string;
		ReviewerType: number;
		ReviewerTypeDescription: string;
		Reason: string;

		objectState: ObjectStateEnum;
		private reviewCompleted = ko.observable<boolean>();

		constructor(reviewer: IReviewer, objectState?: ObjectStateEnum) {
			this.ReviewCompleted = reviewer.ReviewCompleted;
			this.EmployeeId = reviewer.EmployeeId;
			this.EmployeeName = reviewer.EmployeeName;
			this.ReviewerType = reviewer.ReviewerType || ReviewerType.Peer;
			this.ReviewerTypeDescription = reviewer.ReviewerTypeDescription || "Peer";
			this.Reason = reviewer.Reason || "AddedByUser";
			this.reviewCompleted(reviewer.ReviewCompleted);

			if (objectState) {
				this.objectState = objectState;
			} else {
				this.objectState = ObjectStateEnum.Unchanged;
			}
		}

		imageUrl() {
			return "/EmployeeAvatar/Thumbnail/" + this.EmployeeId;
		}

		toggleReview = () => {
			this.objectState = ObjectStateEnum.Modified;
			this.reviewCompleted(!this.reviewCompleted());
		}

		toJson(): IReviewer {
			return <IReviewer>{
				ReviewCompleted: this.reviewCompleted(),
				EmployeeId: this.EmployeeId,
				EmployeeName: this.EmployeeName,
				ReviewerType: this.ReviewerType,
				ReviewerTypeDescription: this.ReviewerTypeDescription,
				Reason: this.Reason,
				ObjectState: this.objectState
			};
		}
	}

} 