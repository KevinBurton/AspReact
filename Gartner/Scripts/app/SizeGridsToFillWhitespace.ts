module Gartner {

	declare var $;

	interface SizeGridOptions {
		containerId?: string;
		gridId?: string;
	}
	
	export class SizeGridsToFillWhitespace {

		private allGridIds: string[];
		private containerId: string;
		private gridId: string;

		private footerHeight: number;
		private windowHeight: number;
		private totalOffsetFromPadding = 265;
		
		onReady(json: SizeGridOptions) {
			this.containerId = json.containerId;
			this.gridId = json.gridId;

			this.allGridIds = [];
			if (this.containerId) {
				$.makeArray($(`#${this.containerId} .k-grid`))
					.map(kendoGrid => this.allGridIds.push(kendoGrid.id));
			} else if (this.gridId) {
				this.allGridIds.push(this.gridId);
			}

			if (this.allGridIds.length > 0) {
				this.footerHeight = $("footer").height();
				this.windowHeight = window.innerHeight;

				this.allGridIds.forEach(gridId => {
					this.addDefaultHeight(gridId);
					this.bindHeightAdjuster(gridId);
				});
			}
		}

		addDefaultHeight(gridId: string) {
			const gridContent = $(`#${gridId} .k-grid-content`);
			if (gridContent.length > 0) {
				const gridContentOffsetTop = gridContent.position().top;
				gridContent.height(this.windowHeight - gridContentOffsetTop - this.footerHeight - this.totalOffsetFromPadding);
			}
		}

		bindHeightAdjuster(gridId: string) {
			const getKendoDataInterval = setInterval(() => {
				const kendoGridData = $(`#${gridId}`).data("kendoGrid");
				if (kendoGridData !== undefined && kendoGridData != null) {
					kendoGridData.bind("dataBound", (dataBoundEvent) => {
						this.removeFixedHeight(dataBoundEvent, gridId);
					});
					clearInterval(getKendoDataInterval);
				}
			}, 100);
		}

		removeFixedHeight(dataBoundEvent, gridId) {
			const gridData = dataBoundEvent.sender._data;
			if (gridData.length > 0) {
				// Remove the fixed height so that the vertical scrollbar disappears.
				$(`#${gridId} .k-grid-content`).height("auto");
			}
		}
	}
}
