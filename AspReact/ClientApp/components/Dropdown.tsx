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

const Dropdown = (props: DropdownProps) => {
    let isBoxEnabled = props.isEnabled;
    if (isBoxEnabled == undefined) {
        isBoxEnabled = true;
    }

    const onSelect = (e) => {
        props.onSelect(e.target.value);
    };

    const listOptions = props.listOptions;

    const getGroups = () => {
        var groups = new Array();
        for (var i = 0; i < listOptions.length; i++) {
            var group = listOptions[i]['Group'];
            if (group && groups.indexOf(group) === -1) {
                groups.push(group);
            }
        }

        return groups;
    }

    const listGroups = getGroups();

    var hasGroups = listGroups.length > 0;

    return (
        <select
            id={props.id}
            placeholder={props.placeholder}
            disabled={!isBoxEnabled}
            onChange={onSelect}
            value={props.selectedValue}
            className="form-control" type="text" tabIndex={0}>
            <option key="0" value="" defaultChecked={true} hidden={true}>{props.placeholder}</option>
            {listOptions != undefined ?
                    (!hasGroups ?
                        listOptions.map((option) => (
                            <option key={option['Value']} value={option['Value']}> {option['Text']} </option>
                    )) : listGroups.map((group) => (
                        <optgroup key={group} label={group}>
                            {listOptions.filter(opt => opt['Group'] === group).map((option) => (
                                <option key={option['Value']} value={option['Value']}> {option['Text']} </option>
                                ))}
                         </optgroup>
                                )))
                    : <option></option>
                }
        </select>
    );
};

export default Dropdown;