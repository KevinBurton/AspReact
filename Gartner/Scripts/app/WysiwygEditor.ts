module Gartner {

    export class WysiwygEditor {
                
        private editorSelector: string;
        private tags: string[][];
       
        private dom = {
            editor: null
        };

        onReady = (json: { editorSelector: string, tags: string[][] }) => {
            this.editorSelector = json.editorSelector;
            this.tags = json.tags;
            this.render();
        }

        render = () => {
            this.bindDom();
            this.dom.editor.ckeditor();
        }

        bindDom = () => {
            this.dom.editor = $(this.editorSelector);
        }
	}
}