module Gartner {
	const triggers = {
		immediate: 'immediate',
		click: 'click'
	};

	interface ReduxBridgeParams {
		trigger: string;
		actionType: string;
		elementId?: string;
		// everything else passed as action data
	}

	export class ReduxBridge {
		onReady(json: ReduxBridgeParams) {
			const findStoreInterval = setInterval(() => {
				const store = (window as any).store;
				if (store) {
					clearInterval(findStoreInterval);

					if (json.trigger === triggers.immediate) {
						this.triggerAction(store, json);
					} else if (json.trigger === triggers.click) {
						EventUtilities.addHandlerToBody('click', `#${json.elementId}`, (event) => {
							event.preventDefault();
							this.triggerAction(store, json);
						});
					}
				}	
			}, 10);
		}

		triggerAction(store: any, json: ReduxBridgeParams) {
			const exclude = (keys: string[]) => {
				return (key: string) => {
					return keys.indexOf(key) === -1;
				};
			};

			const onlyOwnProperties = (obj: Object) => {
				return (key: string) => {
					return obj.hasOwnProperty(key);
				};
			}

			const action = Object.keys(json)
				.filter(exclude(['trigger', 'actionType', 'elementId']))
				.filter(onlyOwnProperties(json))
				.reduce((obj, key) => {
					obj[key] = json[key];
					return obj;
				}, { type: json.actionType});

			store.dispatch(action);
		}
	}
}