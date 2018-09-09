import * as React from 'react';

export const Input = (props: any) => {
    return (
        <input
            {...props}
            className="form-control"
            type="text"
            />
    );
};

export const InputNumber = (props: any) => {
	return (
		<input
			{...props}
			className="form-control"
			type="number"
			/>
	);
};

export const TextArea = (props: any) => {
    return (
        <textarea
            {...props}
            className="form-control"
            rows={3}
            cols={20}
            />
    );
};

export const FormGroup = (props: any) => {
    return (
        <div className="form-group">
            {props.children}
        </div>
    );
};

export interface LabelProps {
    id: string;
    text: string;
    required: boolean;
}

export const Label = (props: LabelProps) => {
    const id = props.id,
        text = props.text,
        required = props.required;

    return (
        <label htmlFor={id} >
            {text} 
            {required ? (<span className="orange">*</span>) : null}
        </label>
    );
};