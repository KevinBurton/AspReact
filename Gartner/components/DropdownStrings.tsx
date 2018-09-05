﻿﻿import * as React from 'react';
﻿﻿import { IOption } from '../models/generic';

export interface DropdownProps {
    id: string; // combo box id
    onSelect: (number) => void;
    placeholder: string;
    selectedValue?: any;
    isEnabled?: boolean;
    listOptions: Array<IOption>;
}

const DropdownStrings = (props: DropdownProps) => {
    let isBoxEnabled = props.isEnabled;
    if (isBoxEnabled == undefined) {
        isBoxEnabled = true;
    }

    const onSelect = (e) => {
        props.onSelect(e.target.value);
    };

    const listOptions = props.listOptions;

    return (
        <select
            id={props.id}
            placeholder={props.placeholder}
            disabled={!isBoxEnabled}
            onChange={onSelect}
            value={props.selectedValue}
            className="form-control" type="text" tabIndex={0}>
                <option key="0" value="" defaultChecked={true} hidden={true}>{props.placeholder}</option>
            {listOptions.map((option) => (
                <option key={option['Value']} value={option['StringValue']}> {option['Text']}</option>
            )) }
        </select>
    );
};

export default DropdownStrings;