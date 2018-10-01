module Gartner {

	export class RoleViewModel implements RadioItem {
		id: number;
		text = ko.observable<string>();
		selected = ko.observable<boolean>();

		constructor(id, text, selected) {
			this.id = id;
			this.text(text);
			this.selected(selected);
		}
	}

} 