/// <reference path="associationpicker.tsx" />
import * as React from 'react';
import AssociationPicker from './AssociationPicker';
import AssociationType from '../enums/AssociationTypeEnum';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';
import ParentItemTitle from './ParentItemTitle';

export interface CreateSessionFromThisModalProps {
	isSaving: boolean;
	onSave: () => void;
	parentItemTitle: string;
	itemHasNoContent: boolean;
	itemId: string;
	eventCode: string;
	onAssociationSelected: (association: AssociationType) => void;
	selectedAssociation: AssociationType;
};

const CreateSessionFromThisModal = (props: CreateSessionFromThisModalProps) => {
	const disabledAssociations = props.itemHasNoContent
		? [AssociationType.Modified, AssociationType.TranslationDirectPickUp, AssociationType.TranslationModified]
		: [];
	return (
		<div className="modal-body">
			<div className="modal-content-block">
				<h5>PARENT ITEM</h5>
				<ParentItemTitle title={props.parentItemTitle} docCode={props.itemId} eventCode={props.eventCode} />
			</div>
			<AssociationPicker
				disabledAssociations={disabledAssociations}
				onAssociationSelected={props.onAssociationSelected}
				selectedAssociation={props.selectedAssociation}
			/>
			<div className="modal-footer">
				<CancelButton disabled={props.isSaving} />
				<SaveButton isSaving={props.isSaving} onSave={props.onSave} savingText="Creating...">
					Next
				</SaveButton>
			</div>
		</div>
	);
};

export default CreateSessionFromThisModal;
