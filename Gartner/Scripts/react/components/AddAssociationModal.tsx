import * as React from 'react';

import AssociationPicker from './AssociationPicker';
import AssociationType from '../enums/AssociationTypeEnum';
import ParentItemPicker from './ParentItemPicker';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';

export interface AddAssociationModalProps {
	isSaving: boolean;
	onAssociationSelected: (association: AssociationType) => void;
	onParentItemSelected: (parentItemId: string) => void;
	onSave: () => void;
	selectedAssociation: AssociationType;
};

const AddAssociationModal = (props: AddAssociationModalProps) => {
	return (
		<div className="modal-body">
			<div className="modal-content-block">
				<ParentItemPicker id="add-parent-item" onParentItemSelected={props.onParentItemSelected} />
			</div>
			<AssociationPicker onAssociationSelected={props.onAssociationSelected} selectedAssociation={props.selectedAssociation} />
			<div className="modal-footer">
				<CancelButton disabled={props.isSaving} />
				<SaveButton isSaving={props.isSaving} onSave={props.onSave} savingText="Adding...">
					Add Association
				</SaveButton>
			</div>
		</div>
	);
};

export default AddAssociationModal;
