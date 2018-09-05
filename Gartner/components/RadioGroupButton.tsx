import * as React from 'react';

import RadioButton from './RadioButton';

export interface RadioGroupButtonProps {
	id: number;
	text: string;
	description: string;
	isChecked: boolean;
	isDisabled: boolean;
	onSelection?: (text) => void;
}

const RadioGroupButton = ({id, isChecked, isDisabled, text, description, onSelection}: RadioGroupButtonProps) => {
	const onClickButton = () => {
		onSelection(id);
	};

	return (
		<RadioButton isChecked={isChecked} onClick={onClickButton} isDisabled={isDisabled}>
			{text}: <span className="text-normal">{description}</span>
		</RadioButton>
	);
};

export default RadioGroupButton;