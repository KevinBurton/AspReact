import * as React from 'react';

import CancelButton from './CancelButton';
import SaveButton from './SaveButton';

export interface RemoveAssociationModalProps {
	isRemovingAssociation: boolean;
	removeAssociation: () => void;
};

const RemoveAssociationModal = (props: RemoveAssociationModalProps) => {
	return (
		<div className="modal-body">
			<div className="modal-content-block">
				<p>
					By clicking Remove Association below, this session will no longer be associated with any other session.
					It will become an Original session that must go through all workflow phases (peer and mandatory review,
					management review, editing, graphics etc.) to complete. Click Cancel to keep the current associations
					for this session.
				</p>
			</div>
			<div className="modal-footer">
				<CancelButton disabled={props.isRemovingAssociation} />
				<SaveButton isSaving={props.isRemovingAssociation} onSave={props.removeAssociation} savingText="Removing...">
					Remove Association
				</SaveButton>
			</div>
		</div>
	);
};

export default RemoveAssociationModal;
