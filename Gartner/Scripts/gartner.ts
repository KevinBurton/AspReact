/// <reference path="typings/jquery/jquery.d.ts" />

module Gartner {

	class Event {

		private callbackName: string;
		private stack;
		triggered: boolean;

		constructor(eventName: string) {
			this.callbackName = eventName;
			this.stack = [];
			this.triggered = false;
		}

		add(instance: any, json: any) {
			this.stack.push({ instance: instance, json: json });
		}

		trigger = () => {
			this.triggered = true;
			while (this.stack.length) {
				var itemToProcess = this.stack.pop(),
					instance = itemToProcess.instance;

				if (instance[this.callbackName]) {
					instance[this.callbackName](itemToProcess.json);
				}
			}
		}

	}

	var events = {
		ready: new Event("onReady")
	};

	export class LoggedInUserInformation {
		userFullName: string;
		userId: number;
		userRole: Array<string>;
		isAdmin: boolean;
		isTeamManager : boolean;
		constructor(userFullName, userId, userRole, isAdmin, isTeamManager) {
			this.userFullName = userFullName;
			this.userId = userId;
			this.userRole = userRole;
			this.isAdmin = isAdmin;
			this.isTeamManager = isTeamManager;
		}
	}

	export var loggedInUserInformation;

	class Instance {
		className: string;
		uniqueId: string;
		instance: any;
			
		constructor(className: string, instance: any, uniqueId?: string) {
			this.className = className;
			this.instance = instance;
			this.uniqueId = uniqueId;
		}
	}
	
	var storedInstances: Array<Instance> = [];

	export var createObject = (className: string, json?: any) => {
		var uniqueId = json !== undefined && json !== null
			? json.uniqueId
			: undefined;

		var storeInstance = json !== undefined
			? json.storeInstance !== undefined
			: false;

		var createUniqueInstance = uniqueId !== undefined;

		if (Gartner[className]) {
			if (createUniqueInstance && allInstancesOfUniqueId(uniqueId, className).length > 0) {
				return;
			}

			var instance = new Gartner[className]();

			if (storeInstance || createUniqueInstance) {
				storedInstances.push(new Instance(className, instance, uniqueId));
			}

			for (var key in events) {
				if (events.hasOwnProperty(key)) {
					events[key].add(instance, json);
					if (events[key].triggered) {
						events[key].trigger();
					}
				}
			}
		} else {
			throw new Error("Javascript Object '{0}' was not found.".replace("{0}", className));
		}
	}

	export var instanceOf = (className: string) => {
		var matching = allInstancesOf(className);

		if (matching.length > 1) {
			throw Error("there was more than one instance of '" + className + "'");
		}
		
		return matching[0];
	}

	export var allInstancesOf = (className: string) => {
		return storedInstances
			.filter(uniqueInstance => {
				return uniqueInstance.className === className;
			})
			.map(uniqueInstance => {
				return uniqueInstance.instance;
			});
	};

	export var allInstancesOfUniqueIds = (uniqueIds: Array<string>, className?: string) => {
		return storedInstances
			.filter(uniqueInstance => {
				return uniqueIds.indexOf(uniqueInstance.uniqueId) !== -1;
			})
			.filter(uniqueInstance => {
				return className === undefined || uniqueInstance.className === className;
			})
			.map(uniqueInstance => {
				return uniqueInstance.instance;
			});
	}

	export var allInstancesOfUniqueId = (uniqueId: string, className?: string) => {
		return storedInstances
			.filter(uniqueInstance => {
				return uniqueId === uniqueInstance.uniqueId;
			})
			.filter(uniqueInstance => {
				return className === undefined || uniqueInstance.className === className;
			})
			.map(uniqueInstance => {
				return uniqueInstance.instance;
			});
	}

	$(document).ready(events.ready.trigger);

} 