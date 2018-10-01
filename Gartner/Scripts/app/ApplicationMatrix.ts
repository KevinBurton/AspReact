module Gartner {
	
	declare var callUsageTrackerWithParams: any;
	declare var ut_unique_id: any;

	export interface IApplicationMatrixParams {
		applicationMatrixUniqueIdUrl: string;
		applicationMatrixUrl: string;
		itemId?: number;
	}

	export class ApplicationMatrix {
		appmetricsScriptCalled = false;
		appmetricsUniqueIdScriptCalled = false;
		itemId: number;
		
		onReady(json: IApplicationMatrixParams) {
			const milliseconds = (new Date).getTime();
			
			this.itemId = json.itemId;
		
			let appMetricsUniqueIdUrl = null;
			let appMetricsUrl = null;

			if (json.applicationMatrixUniqueIdUrl) {
				appMetricsUniqueIdUrl = `${json.applicationMatrixUniqueIdUrl}&donotcache=${milliseconds}`;
			}

			if (json.applicationMatrixUrl) {
				appMetricsUrl = json.applicationMatrixUrl;
			}

			if (appMetricsUniqueIdUrl !== null && appMetricsUrl !== null) {
				const appmetricsUniqueIdScript = this.getDynamicTag(appMetricsUniqueIdUrl);
				const appmetricsScript = this.getDynamicTag(appMetricsUrl);

				document.getElementsByTagName('head')[0].appendChild(appmetricsUniqueIdScript);
				document.getElementsByTagName('head')[0].appendChild(appmetricsScript);

				appmetricsScript.onload = () => {
					this.appmetricsScriptCalled = true;
					this.runAppMetrics();
				}
				appmetricsUniqueIdScript.onload = () => {
					this.appmetricsUniqueIdScriptCalled = true;
					this.runAppMetrics();
				}
			}
			
		}

		runAppMetrics = () => {
			try {
				if (this.appmetricsScriptCalled && Gartner.loggedInUserInformation.userId) {
					const dataMap = {};

					dataMap['application'] = 'cpp_app';
					dataMap['employee_id_num'] = Gartner.loggedInUserInformation.userId;
					dataMap['url_with_parameters'] = window.location.href;
					dataMap['referrer_url'] = document.referrer;

					if (this.itemId) {
						dataMap['item_id_num'] = this.itemId;
					}

					if (Gartner.loggedInUserInformation.userRole) {
						dataMap['user_roles'] = Gartner.loggedInUserInformation.userRole.toString();
					}

					if (typeof ut_unique_id !== 'undefined') {
						dataMap['id_num'] = ut_unique_id;
					}
						
					callUsageTrackerWithParams(dataMap, 'standard');
				}
			} catch (exception) {

			}
		}

		getDynamicTag = (url: string) => {
			const dynamicScript = document.createElement('script');
			dynamicScript.type = 'text/javascript';
			dynamicScript.charset = 'utf-8';
			dynamicScript.defer = true;
			dynamicScript.async = true;
			dynamicScript.src = url;
			return dynamicScript;
		}
	}
}