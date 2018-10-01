/// <reference path="../typings/jquery/jquery.d.ts" />

interface IFilterParams {
	gridId: string;
	statuses: Array<string>;
    sessionCategories: Array<string>;
    series: Array<string>;
	researchElementType: Array<string>;
	authorRoles: Array<string>;
	reviewerTypes: Array<string>;
	roles: Array<string>;
	like: Array<string>;
}

module Gartner {

	var dataSources = {};
	const booleanOptions = ['Yes', 'No'];

	export class Filters {

		private gridId: string;

		onReady(json: IFilterParams) {
			this.gridId = json.gridId;

			dataSources[this.gridId] = {
				status: json.statuses,
                sessionCategory: json.sessionCategories,
                series: json.series,
				researchElementType: json.researchElementType,
				authorRole: json.authorRoles,
				reviewerType: json.reviewerTypes,
				role: json.roles,
				like: json.like
			};
		}
	}

	var createDropdownInPlaceOfElement = (element: JQuery, dataSource: Array<string>) => {
		var dropdown = $('<select>')
				.addClass('filter-dropdown')
				.addClass('form-control')
				.attr('data-bind', element.attr('data-bind'))
				.append($('<option>').text('--Select--').val(''));

	    for (var i = 0; i < dataSource.length; i++) {
	        dropdown.append($('<option>').text(dataSource[i]));
	    }

	    element.replaceWith(dropdown);
    };

    var createHardCodedDropdown = (element: JQuery, dataSource: Array<string>) => {
        var dropdown = $('<select>')
            .addClass('filter-dropdown')
            .addClass('form-control')
            .attr('data-bind', element.attr('data-bind'))
            .append($('<option>').text('--Select--').val(''));

        
        dropdown.append($('<option>').text('Primary Author'));
        dropdown.append($('<option>').text('Co-Author'));
        dropdown.append($('<option>').text('Speaker'));
        
        element.replaceWith(dropdown);
    };

	export function getCurrentFilters(gridDataSource: kendo.data.DataSource) {
		if (gridDataSource.filter() == null) {
			return null;
		}
		else {
			return gridDataSource.filter().filters;
		}
	}

	export function getDropdownFilter(columnKey: string, element: JQuery, gridId: string) {

		element.parent().find('select').remove();
		element.parent().find('.k-filter-help-text').text('Show items with:');

        if (gridId === 'IdeasGrid' && columnKey === 'authorRole') {
	        createHardCodedDropdown(element, dataSources[gridId][columnKey]);
	    } else {
            createDropdownInPlaceOfElement(element, dataSources[gridId][columnKey]);
	    }

	}

	export function getNormalFilter(element: JQuery) {
		element.parent().find('select')
			.removeAttr('data-role')
			.addClass('form-control')
			.addClass('filter-dropdown');

		element
			.addClass('form-control')
			.addClass('filter-dropdown');
	}
	
	export function refreshFiltersForGrid(gridId: string) {
		if (!dataSources[gridId]) {
			dataSources[gridId] = {};
		}

		dataSources[gridId].NoContent = booleanOptions.slice(0);
		dataSources[gridId].NeedsLivePolling = booleanOptions.slice(0);
		loadFilter(gridId,
				'/EventDashboard/SessionCategoryDataSource',
				'sessionCategory',
				true,
                mapProp('Description'));
	    loadFilter(gridId, '/Filters/SeriesDataSource', 'series', true,
	        mapProp('Description'));
		loadFilter(gridId, '/Filters/ItemStatusDataSource', ['StatusTextWithDeclinedInformation', 'status'], true,
			mapProp('Description'));
		loadFilter(gridId, '/Filters/AuthorRoleDataSource', (gridId === 'WorkInProgressGrid' ? 'role' : 'authorRole'), true,
            mapProp('Description'));
		loadFilter(gridId, '/Filters/ReviewerTypeDataSource', 'reviewerType', true,
			mapProp('Description'));

		if (gridId === 'WorkInProgressGrid') {
			loadFilter(gridId, '/Filters/ItemRoleDataSource', 'role', true, 
				mapProp('Description'));
		}
		
		if (gridId === 'EventItemsGrid' || gridId === 'InitialApprovalGrid' || gridId === 'FinalApprovalGrid') {
			loadFilter(gridId, '/ApprovalDashboard/LikeTypeDataSource', 'like', true,
				[
					removeEmptyIdItems,
					sortBy('Id'),
					mapProp('LikeDescription')
				]);
			loadFilter(gridId, '/EventDashboard/NewnessDataSource', 'New', true,
				[
					removeEmptyIdItems,
					mapProp('NewnessDescription')
				]);
			loadFilter(gridId, '/EventDashboard/ResearchElementDataSource', 'ResearchElement', true,
				[
					removeEmptyIdItems,
					mapProp('ResearchDescription')
				]);
			loadFilter(gridId, '/EventDashboard/IndustryDataSource', 'Industry', true, mapProp('IndustryName'));
			loadFilter(gridId, '/EventDashboard/ContentFocusDataSource', 'ContentFocus', true,
				[
					removeEmptyIdItems,
					sortBy('ContentFocusDescription'),
					mapProp('ContentFocusDescription')
				]);
			loadFilter(gridId, '/EventDashboard/ContentAspectDataSource', 'ContentAspect', true,
				[
					removeEmptyIdItems,
					mapProp('ContentAspectDescription')
				]);
			loadFilter(gridId, '/EventDashboard/ContentMaturityDataSource', 'ContentMaturity', true,
				[
					removeEmptyIdItems,
					mapProp('ContentMaturityDescription')
				]);
        }
	}

	export function refreshFiltersForApprovalGrid(gridId: string, eventId: number) {
		refreshFiltersForGrid(gridId);
		const eventIdInteger = Math.round(eventId);

		loadFilter(gridId, `/ApprovalDashboard/TrackDataSource?eventId=${eventIdInteger}`, 'track', true,
			[
				removeEmptyIdItems,
				sortBy('Id'),
				mapProp('TrackName')
			]);
	}

	export function refreshFiltersForAgendasGrid(gridId: string) {
		if (!dataSources[gridId]) {
			dataSources[gridId] = {};
		}

		loadFilter(gridId, '/Filters/AgendaStatusesDataSource', 'agendaStatuses', true, mapProp('Description'));
	}

	function isArray(x: any): boolean {
		return Object.prototype.toString.call(x) === '[object Array]';
	}

	function loadFilter(gridId: string, url: string, filterKeys: string | string[], cached: boolean = true, ops?: Function | Function[]) {
		const filterKeyHasMultiple = isArray(filterKeys);
		const opsHasMultiple = ops && isArray(ops);

		const filterKey = (filterKeyHasMultiple ? filterKeys[0] : filterKeys) as string;

		if (!cached || (dataSources[gridId] && !dataSources[gridId][filterKey])) {
			ServiceUtilities.get<Array<any>>(url)
				.then(arr => {
					if (arr && ops) {
						if (opsHasMultiple) {
							let latest = arr;
							(ops as Function[]).forEach(op => latest = op(latest));
							return latest;
						} else {
							return (ops as Function)(arr);
						}
					}

					return arr;
				})
				.done(filters => {
					if (filterKeyHasMultiple) {
						(filterKeys as string[]).forEach(x => dataSources[gridId][x] = filters);
					} else {
						dataSources[gridId][filterKey] = filters;
					}
				});
		}
	}

	function removeEmptyIdItems(arr: any[]): any[] {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].Id == null) {
				arr.splice(i, 1);
			}
		}

		return arr;
	}

	function mapProp(property: string) {
		return (arr: any[]): string[] => arr.map(x => x[property]);
	}

	function sortBy(property: string) {
		return (arr: any[]): any[] => arr.sort(x => x[property]);
	}
}