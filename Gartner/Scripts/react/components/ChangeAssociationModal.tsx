import * as React from 'react';

import AssociationPicker from './AssociationPicker';
import AssociationType from '../enums/AssociationTypeEnum';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';

export interface ChangeAssociationModalProps {
	parentItemTitle: string;
	isSaving: boolean;
	onAssociationSelected: (association: AssociationType) => void;
	onSave: () => void;
	selectedAssociation: AssociationType;
}

const ChangeAssociationModal = (props: ChangeAssociationModalProps) => {

	return (
			<div className="modal-body">
					<div className="modal-content-block">
						<label className="col-sm-2 control-label">Parent Item</label>
						<br/>
						<label className="col-sm-12 control-label">{props.parentItemTitle}</label>
						<br/>
					</div>
					<AssociationPicker onAssociationSelected={props.onAssociationSelected} selectedAssociation={props.selectedAssociation}/>
					<div className="modal-footer">
						<CancelButton disabled={props.isSaving} />
						<SaveButton isSaving={props.isSaving} onSave={props.onSave} savingText="Changing Association...">
							Change Association
						</SaveButton>
					</div>
			 </div>
	);
};

export default ChangeAssociationModal;