declare var CKEDITOR: any;

interface JQuery {
	ckeditor(options?: any): JQuery;
	tooltip(options: any): JQuery;
}

ko.bindingHandlers['filesUpload'] = {
	init: (element, valueAccessor) => {
		$(element).on('change', () => {
			const files = Array.prototype.map.call(element.files, file => file);
			valueAccessor()(files);
		});
	},

	update: (element, valueAccessor) => {
		if (ko.unwrap(valueAccessor()) === undefined) {
			(<any>$(element).wrap('<form>').closest('form').get(0)).reset();
			$(element).unwrap();
		}
	}
}

ko.bindingHandlers["richText"] = {

	init: (element, valueAccessor, allBindingsAccessor) => {
		var id = $(element).attr("id");
		var itemId = allBindingsAccessor.get('itemId');
		var allowedToUploadFile = allBindingsAccessor.get('allowedToUploadFile');
		
		$(element).attr("CurrentItemId", itemId);
		$(element).attr("CurrentItemAllowedToUploadFile", allowedToUploadFile);
		var ckEditorValue = valueAccessor();
		var ignoreChanges = false;
		//handle disposal (if KO removes by the template binding)
		ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
			if (CKEDITOR.instances[id]) {
				CKEDITOR.instances[id].focusManager.blur = () => { return; };
				CKEDITOR.remove(CKEDITOR.instances[id]);
			};
		});

		var instance = CKEDITOR.replace(id,
		{
			on: {
				change() {
					ignoreChanges = true;
					ckEditorValue(instance.getData());
					ignoreChanges = false;
				},
				instanceReady(evt) {
					var data = instance.getData();
					if (data === null || data === undefined || data === "") {
						instance.setData("");
					}
				}
			}
		   
		});


		ckEditorValue.subscribe(newValue => {
			if (!ignoreChanges) {
				instance.setData(newValue);
			}
		});

		//wire up the blur event to ensure our observable is properly updated
		CKEDITOR.instances[id].focusManager.blur = () => {
			var observable = valueAccessor();
			if (observable) {
				observable($(element).val());
			}
		};

	   
	},

	update: (element, valueAccessor) => {
		var val = ko.utils.unwrapObservable(valueAccessor());
		$(element).val(val || '');
	}

}

ko.bindingHandlers["tooltip"] = {
	init: (element, valueAccessor) => {
		var local = ko.utils.unwrapObservable(valueAccessor()),
			options = {};

		ko.utils.extend(options, (<any>ko.bindingHandlers["tooltip"]).options);
		ko.utils.extend(options, local);

		$(element).tooltip(options);

		ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
			$(element).tooltip("destroy");
		});
	},
	options: {
		placement: "top",
		trigger: "hover"
	}
};

kendo.ui.ComboBox.fn["clear"] = kendo.ui.AutoComplete.fn["clear"] = function () {
	if (!!this.text) {
		this.text("");
	}
	if (!!this.value) {
		this.value(null);
	}
	this.trigger("change");
	this._prev = this.oldIndex = this._old = this._last = undefined;
};