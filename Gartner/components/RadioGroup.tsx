import * as React from 'react';

import RadioGroupButton, { RadioGroupButtonProps } from './RadioGroupButton';

export interface RadioGroupProps {
	onSelected: (id: number) => void;
	radioButtonsProps: RadioGroupButtonProps[];
	selectedOption: number;
	disabledOptions?: number[];
}

export const RadioGroup = (props: RadioGroupProps) => {
	return (
		<form className="form-horizontal" role="form">
			{props.radioButtonsProps.map(r => {
				const isChecked = (r.id === props.selectedOption);
				const isDisabled = (props.disabledOptions || []).indexOf(r.id) > -1;

				return (
					<RadioGroupButton
						key={r.id}
						id={r.id}
						isChecked={isChecked}
						isDisabled={isDisabled}
						text={r.text}
						description={r.description}
						onSelection={props.onSelected} />
				);
			})}
		</form>
	);
};

export default RadioGroup;