import * as React from 'react';

import ComboBox from './kendo/ComboBox';

export interface ParentItemPickerProps {
	id: string; // ComboBox id
	onParentItemSelected: (parentItem) => void;
}

const ParentItemPicker = (props: ParentItemPickerProps) => {

	const comboBoxId = props.id;

	const onSelect = (parentItemId) => {
		props.onParentItemSelected(parentItemId);
	};

	return (
		<form className="form-horizontal" role="form">
			<div className="form-group">
				<label htmlFor="parent-item" className="col-sm-2 control-label">Parent Item</label>
				<div className="col-sm-10">
					<ComboBox
						id={comboBoxId}
						name={comboBoxId}
						onSelect={onSelect}
						url="/Item/GetWorkInProgressItems"
						dataTextField="DisplayText"
						dataValueField="Id"
						placeholder="Search items by title or item id..."
					/>
				</div>
			</div>
		</form>
	);
};

export default ParentItemPicker;
