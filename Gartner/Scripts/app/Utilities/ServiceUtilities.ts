module Gartner.ServiceUtilities {
	function getDataSourceData(data: any) {
		if (data.filter && data.filter.filters.length > 0) {
			return {
				text: data.filter.filters[0].value
			};
		} else {
			return {
				text: ""
			};
		}
	}

	export function getComboBoxDataSource(url: string) {
		return {
			filter: [],
			schema: { errors: "Errors" },
			serverFiltering: true,
			transport: {
				read: {
					url: url,
					data: getDataSourceData
				}
			}
		};
	}

	export function post<T>(url: string, json: string): JQueryPromise<T> {
		return ajax(<JQueryAjaxSettings>{
			url: url,
			data: json,
			type: 'POST',
			contentType: 'application/json',
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function ajax<T>(options: JQueryAjaxSettings): JQueryPromise<T> {
		ErrorUtilities.clearErrors();

		return $.ajax(options)
			.then((response) => {
				return $.Deferred((deferred) => {
					if (response && response.exceptionMessage) {
						ErrorUtilities.showErrorFromResponse(response);
						return deferred.reject(response);
					}

					return deferred.resolve(response);
				}).promise();
			});
	}

	export function get<T>(url: string): JQueryPromise<T> {
		return $.ajax({
			url: url,
			cache: false
		})
		.fail(() => ErrorUtilities.showGeneralError());
	}

	export function getMock<T>(data: T): JQueryPromise<T> {
		var promise = $.Deferred<T>();

		setTimeout(() => {
			promise.resolve(data);
		}, 1000);

		return promise;
	}

	export function indexOfObjArray(objArray: Array<any>, isMatch: (obj: any) => boolean) {
		for (var i = 0, len = objArray.length; i < len; i++) {
			if (isMatch(objArray[i])) {
				return i;
			}
		}
		return -1;
	}

	export function distinctBy(propertyName: string) {
			  return (obj, index: number, self) => {
			var firstIndex = indexOfObjArray(self, (other: any) => {
				return obj[propertyName] === other[propertyName];
			});

			return firstIndex === index;
		}
	   }

} 