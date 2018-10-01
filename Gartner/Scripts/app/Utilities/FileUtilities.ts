module Gartner.FileUtilities {
	export interface FileResult {
		file: File;
		data: ArrayBuffer;
	}

	export function getDataForFiles(files: File[]): JQueryPromise<Array<FileResult>> {
		const deferred = $.Deferred();
		if (files) {
			const filesUploading = files.map(file => getDataForFile(file));
			return whenAll<FileResult>(filesUploading);
		} else {
			return deferred.resolve([]);
		}
	}

	function getDataForFile(file: File): JQueryPromise<FileResult> {
		const deferred = $.Deferred<FileResult>();
		const reader = new FileReader();

		reader.onloadend = () => {
			const data = reader.result as ArrayBuffer;
			deferred.resolve({
				file: file,
				data: new Uint8Array(data)
			});
		};

		reader.readAsArrayBuffer(file);

		return deferred;
	}

	function whenAll<T>(deferreds: Array<JQueryPromise<T>>): JQueryPromise<Array<T>> {
		var deferred = $.Deferred();

		$.when.apply($, deferreds)
			.then(
			function () {
				deferred.resolve(Array.prototype.slice.call(arguments));
			},
			function () {
				deferred.reject(Array.prototype.slice.call(arguments));
			}
			);

		return deferred.promise();
	}
}