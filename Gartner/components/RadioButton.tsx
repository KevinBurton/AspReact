import * as React from 'react';
import classNames from '../utils/classnames';

export interface RadioButtonProps {
	isChecked: boolean;
	onClick: () => void;
	isDisabled?: boolean;
}

const RadioButton = (props: RadioButtonProps) => {

	const onClick = (event) => {
		event.preventDefault();

		if (props.isDisabled) {
			return;
		}

		props.onClick();
	};

	const radioClass = classNames({
		'radio': true,
		'checked': props.isChecked,
		'disabled': props.isDisabled
	});

	return (
		<label className={radioClass} onClick={onClick}>
			<span className="icons">
				<span className="first-icon fui-radio-unchecked"></span>
				<span className="second-icon fui-radio-checked"></span>
			</span>
			{(props as any).children}
		</label>
	);
};

export default RadioButton;
