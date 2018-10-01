module Gartner {
	
	export interface DiscussionAttachment {
		name: string;
		id?: number;
		url?: string;
		file?: File;
	}

	export class DiscussionAttachments {
		private itemId: number;
		private attachments = ko.observableArray<DiscussionAttachment>([]);

		filesFromUI = ko.observableArray<File>();

		constructor(itemId: number) {
			this.itemId = itemId;

			this.filesFromUI.subscribe(newFiles => this.addToAttachments(newFiles));
		}

		addToAttachments = (files: Array<File>) => {
			FileUtilities.getDataForFiles(files)
				.done(fileResults => {
					const fileResultsAsAttachments = fileResults.map<DiscussionAttachment>((fileResult) => {
						return {
							name: fileResult.file.name,
							file: fileResult.file
						} as DiscussionAttachment;
					});

					this.attachments(this.attachments().concat(fileResultsAsAttachments));
					this.filesFromUI(undefined);
				});
		}

		getAttachmentsNeedingUpload = () : Array<DiscussionAttachment> => {
			return this.attachments().filter(x => !x.url);
		}

		remove = (attachment: DiscussionAttachment) => {
			if (attachment.url) {
				return;
			}

			this.attachments(this.attachments().filter(x => x.name !== attachment.name));
		}

		addSavedAttachment = (files: Array<IDiscussionFile>) => {
			this.attachments(files.map<DiscussionAttachment>(file => {
				return {
					name: file.FileName,
					url: file.Url
				} as DiscussionAttachment;
			} ));
		}
	}
}