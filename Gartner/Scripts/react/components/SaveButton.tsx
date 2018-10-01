import * as React from 'react';

export interface SaveButtonProps {
	isSaving: boolean;
	onSave: () => void;
	savingText?: string;
	children?: any;
}

const SaveButton = (props: SaveButtonProps) => {
	const savingText = props.savingText || 'Saving...';
	return (
		<button type="button" className="btn btn-primary" onClick={props.onSave} disabled={props.isSaving}>
			{props.isSaving ? savingText : props.children}
		</button>
	);
};

export default SaveButton;