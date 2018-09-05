import * as React from 'react';

export interface CancelButtonProps {
	onCancel?: () => void;
    disabled?: boolean;
    buttonText?: string;
}

const CancelButton = ({onCancel, disabled = false,  buttonText="Cancel"}: CancelButtonProps) => {
	const onClick = (event) => {
		event.preventDefault();

		if (onCancel) {
			onCancel();
		}
	};
	

	return (
        <button type="button" className="btn btn-default" value={buttonText} data-dismiss="modal" onClick={onClick} disabled={disabled}  >
            {buttonText}
		</button>
	);
};

export default CancelButton;