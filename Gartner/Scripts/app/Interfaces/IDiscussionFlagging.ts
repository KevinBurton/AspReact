module Gartner
{
	export interface IDiscussionFlagging{
		DiscussionId: number;
		FlagTypeId: number;
		FlagValue: boolean;
		CreatedBy : number;
		CreatedByName: string;
		FormattedCreatedTime: string;
		UpdatedTime: string;
		UpdatedByName: string;
		UpdatedBy: number;
		FormattedUpdatedTime: string;
		Id: number;
		IsViewOnlyFlag: boolean;
    }
}
	