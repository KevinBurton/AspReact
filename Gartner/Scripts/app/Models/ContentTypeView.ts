module Gartner.Models{
	export class ContentTypeView implements Gartner.IContentTypeView {
		ItemId: number;
		ContentTypeId: number;
		ContentTypeDesc: string;
		SubTypeId: number;
		SubTypeDesc: string;

		constructor(itemId: number, contentTypeId: number, contentTypeDesc: string, subTypeId: number, subTypeDesc: string);
		constructor(itemId: number, contentTypeId: number, contentTypeDesc: string, subTypeId: number, subTypeDesc: string) {
			this.ItemId = itemId;
			this.ContentTypeId = contentTypeId;
			this.ContentTypeDesc = contentTypeDesc;
			this.SubTypeId = subTypeId;
			this.SubTypeDesc = subTypeDesc;
		}
	}
}