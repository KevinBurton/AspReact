module Gartner.DiffUtilities {
	export interface ObjectStateCompareOptions<T> {
		clientArray: Array<T>;
		dbArray: Array<T>;
		propertiesThatIndicateUnique: Array<string>;
		propertiesThatIndicateChanged: Array<string>;
	}

	function getDeleted<T>(options: ObjectStateCompareOptions<T>): Array<T> {
		return options.dbArray
			.filter(notIn(options.clientArray, matchBy(options.propertiesThatIndicateUnique)))
			.map(withState(ObjectStateEnum.Deleted));
	}

	function getAdded<T>(options: ObjectStateCompareOptions<T>): Array<T> {
		return options.clientArray
			.filter(notIn(options.dbArray, matchBy(options.propertiesThatIndicateUnique)))
			.map(withState(ObjectStateEnum.Added));
	}

	function getUpdated<T>(alreadySaved: Array<T>, options: ObjectStateCompareOptions<T>): Array<T> {
		return alreadySaved
			.filter(notIn(options.dbArray, matchBy(options.propertiesThatIndicateChanged)))
			.map(withState(ObjectStateEnum.Modified));
	}

	function getUnchanged<T>(alreadySaved: Array<T>, options: ObjectStateCompareOptions<T>): Array<T> {
		return alreadySaved
			.filter(containedIn(options.dbArray, matchBy(options.propertiesThatIndicateChanged)))
			.map(withState(ObjectStateEnum.Unchanged));
	}

	export function compareToGetObjectState<T>(options: ObjectStateCompareOptions<T>): Array<T> {
		var deleted = getDeleted(options);
		var added = getAdded(options);

		var alreadySaved = options.clientArray
			.filter(
				containedIn(options.dbArray,
					matchBy(options.propertiesThatIndicateUnique)
				)
			);

		var updated = getUpdated(alreadySaved, options);
		var unchanged = getUnchanged(alreadySaved, options);

		return deleted
			.concat(added)
			.concat(updated)
			.concat(unchanged);
	}

	export function notIn(otherArray, comparer: (a, b) => boolean) {
		return (item) => {
			return !otherArray.some(x => comparer(x, item));
		};
	}

	export function containedIn(otherArray, comparer: (a, b) => boolean) {
		return (item) => {
			return otherArray.some(x => comparer(x, item));
		};
	}

	export function matchBy(propertyNames: Array<string>): (a, b) => boolean {
		return (a, b) => {
			return propertyNames.every((propertyName) => {
				return a[propertyName] === b[propertyName];
			});
		};
	}

	export function withState(objectState: ObjectStateEnum) {
		return (item) => {
			item.ObjectState = objectState;
			return item;
		};
	}
} 