module Gartner {

	interface ToggleGridDataSourceOptions {
		gridId: string;
		toggleId: string;
		alternateUrl: string;
	}

	export class ToggleGridDataSource {

		private firstClick: boolean;
		private gridDataSource: any;
		private gridId: string;
		private toggleId: string;
		private alternateUrl: string;
		private originalUrl: string;

		onReady = (json: ToggleGridDataSourceOptions) => {
			this.firstClick = true;
			this.gridId = json.gridId;
			this.toggleId = json.toggleId;
			this.alternateUrl = json.alternateUrl;

			var getGridInterval = setInterval(() => {
				const grid = $(`#${this.gridId}`).data('kendoGrid') as kendo.ui.Grid;
				if (grid !== undefined && grid != null) {
					this.gridDataSource = grid.dataSource as any;
					clearInterval(getGridInterval);
				}
			}, 100);

			$(`#${this.toggleId}`)
				.change(this.toggle)
				.prop('checked', false);
		}

		toggle = () => {
			var currentDataSourceReadUrl = this.gridDataSource.transport.options.read.url;
			if (this.firstClick) {
				this.originalUrl = currentDataSourceReadUrl;
				this.firstClick = false;
			}

			if (currentDataSourceReadUrl === this.originalUrl) {
				this.gridDataSource.transport.options.read.url = this.alternateUrl;
			} else {
				this.gridDataSource.transport.options.read.url = this.originalUrl;
			}

			this.gridDataSource.read();
		}
	}
}
