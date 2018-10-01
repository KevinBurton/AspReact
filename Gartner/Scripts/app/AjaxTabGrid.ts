module Gartner {

    export class AjaxTabGrid {
        private isLoading = false;
        private grid: kendo.ui.Grid;
        // used to ensure that we have a grid to bind / read from
        private gridPromise = $.Deferred();

        onReady(json: { tabId: string; gridId: string }) {
            EventUtilities.addHandlerToBody("click", "#" + json.tabId, this.startLoad);
            this.getGrid(json.gridId);
            
            $(window).resize(() => {
                this.resizeGrid(json.gridId);
            });
        }

        getGrid = (gridId: string) => {
            var getGridInterval = setInterval(() => {
                this.grid = $("#" + gridId).data("kendoGrid");
                if (this.grid !== undefined) {
                    this.grid.bind("dataBound", () => this.isLoading = false);
                    clearInterval(getGridInterval);
                    this.gridPromise.resolve();
                }
            }, 100);
        }

        startLoad = () => {
            this.gridPromise.done(this.load);
        }

        load = () => {
            if (this.isLoading) return;

            if (this.grid.dataSource.data().length === 0) {
                this.grid.dataSource.read();
                this.isLoading = true;
            }
        }
        
        resizeGrid = (gridId) => {
            $("#" + gridId).data("kendoGrid").resize();
        }
    }
}