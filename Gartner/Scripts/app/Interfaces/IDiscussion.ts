module Gartner {
	export interface IDiscussion {
		Id: number;
		EntityId: number;
		ParentId: number;
		TopmostParentId: number;
		Subject: string;
		CommentDetail: string;
		CreatedBy: number;
		Children?: Array<IDiscussion>;
		CreatedTime: Date;
		UpdatedTime: Date;
		UpdatedBy: number;
		FormattedCreatedTime: string;
		FormattedUpdatedTime: string;
		CreatedByName: string;
		UpdatedByName: string;
		Flags: Array<IDiscussionFlagging>;
		Files: Array<IDiscussionFile>;
		Roles: string;
		IsReviewComplete: boolean;
	}
} 