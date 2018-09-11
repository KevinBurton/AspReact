import * as React from 'react';
import classNames from '../utils/classnames';

export interface CheckBoxProps {
	children?: any;
	isChecked: boolean;
	isDisabled?: boolean;
	onChange: () => void;
    noForm?: boolean;
}

const CheckBox = (props: CheckBoxProps) => {

	const onCheckBoxChange = (event: any) => {
		event.preventDefault();
		if (props.isDisabled) {
			return;
		}

		props.onChange();
	};

	const checkBoxClass = classNames({
		'checkbox': true,
		'checked': props.isChecked,
		'disabled': props.isDisabled || false
	});

	const renderCheckbox = () => {
		return (
			<label className={checkBoxClass} onClick={onCheckBoxChange}>
				<span className="icons">
					<span className="first-icon fui-checkbox-unchecked"></span>
					<span className="second-icon fui-checkbox-checked"></span>
				</span>
				<span className="text-normal">{props.children}</span>
			</label>
		);
	}

	return (
		<div>
			{props.noForm
				? renderCheckbox()
                : <form className="form-horizontal" role="form" >
					{renderCheckbox()}
				</form>
			}
		</div>
	);
}

export default CheckBox;
