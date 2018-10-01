module Gartner {

    export class ItemComboBox {
                
        private wrapperSelector: string;
        private comboBoxSelector: string;
        private selectButtonSelector: string;
        public selectButtonClickedCallback;

        private dom = {
            wrapper: null
        };

        onReady = (json: { wrapperSelector: string, comboBoxSelector: string, selectButtonSelector: string }) => {
            this.wrapperSelector = json.wrapperSelector;
            this.comboBoxSelector = json.comboBoxSelector;
            this.selectButtonSelector = json.selectButtonSelector;
            this.render();
        }

        render = () => {
            this.bindDom()
            this.bindEvents();
        }

        bindDom = () => {
            this.dom.wrapper = $(this.wrapperSelector);
        }

        bindEvents = () => {
            this.dom.wrapper.on('click', this.selectButtonSelector, () => {
                if (this.selectButtonClickedCallback != null) {
                    const comboBoxData = this.dom.wrapper.find(this.comboBoxSelector).data('kendoComboBox');
                    if (!$.isNumeric(comboBoxData.value())) {
                        return;
                    }
                    const itemId = comboBoxData.value();
                    this.selectButtonClickedCallback(itemId);
                }
            });
        }

        clear = () => {
            var comboBoxData = this.dom.wrapper.find(this.comboBoxSelector).data('kendoComboBox');
            comboBoxData.text('');
        }
	}
}