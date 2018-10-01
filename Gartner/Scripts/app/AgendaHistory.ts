module Gartner {

    declare var jsondiffpatch: any;

    export class AgendaHistory {
        private diffpatcher: any;
        private snapshotsJson: string;
        private targetIdPrefix: string;
        private snapshots: any[] = [];

        onReady = (json: { snapshots: string, targetIdPrefix: string }) => {
            this.snapshotsJson = json.snapshots;
            this.targetIdPrefix = json.targetIdPrefix;
            this.init();
            this.render();
        }

        init = () => {
            this.parseShapshots();

            this.diffpatcher = jsondiffpatch.create({
                objectHash(obj) {
                    return JSON.stringify(obj);
                },
                arrays: {
                    detectMove: false,
                    includeValueOnMove: false
                },
                textDiff: {
                    minLength: 1
                }
            });

            jsondiffpatch.formatters.html.hideUnchanged();
        }

        render = () => {
            const lenght = this.snapshots.length;

            for (let i = 0; i < lenght - 1; i++) {
                let html = this.diff(this.snapshots[i + 1], this.snapshots[i]);

                html = this.cleanHtml(html);

                $(`#${this.targetIdPrefix}${i}`).html(html);
            }
        }

        diff = (oldObject, newObject): string => {
            const delta = this.diffpatcher.diff(oldObject, newObject);

            return jsondiffpatch.formatters.html.format(delta, oldObject);
        }
        
        cleanHtml = (html: string): string => {
            html = html.replace(/&amp;/g, '&');
            html = html.replace(/\[\]\n  /g, '');
            html = html.replace(/\[/g, '');
            html = html.replace(/\]/g, '');
            html = html.replace(/\{/g, '');
            html = html.replace(/\}/g, '');
            html = html.replace(/  \,/g, '  ');
            html = html.replace(/ \,/g, ' ');
            html = html.replace(/&quot;/g, '');
            html = html.replace(/    /g, '  '); 
            html = html.replace(/\n  \n  \n  \n  /g, '\n  \n  ');
            html = html.replace(/\n  \n  \n/g, '');
            html = html.replace(/\n  \n[^ ]/g, '<');
            html = html.replace(/\>\n  \n  R/g, '>  R');

            return html;
        }

        parseShapshots = () => {
            const jsonArray: string[] = JSON.parse(this.snapshotsJson);
            jsonArray.forEach((value, index, array) => {
                this.snapshots.push(JSON.parse(value, jsondiffpatch.dateReviver));

                if (index + 1 === array.length) {
                    this.snapshots.push({});
                }
            });
        }
    }
}