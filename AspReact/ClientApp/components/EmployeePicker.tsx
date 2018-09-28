import * as React from 'react';
import ComboBox from './kendo/ComboBox';
import * as $ from "jquery";

export interface EmployeePickerProps {
    id: string; // combo box id
    buttonText: string;
    onSelect: (employee) => void;
    isEnabled?: boolean;
}


const EmployeePicker = (props: EmployeePickerProps) => {
    const comboBoxId = props.id;

    let selectedEmployee = undefined;
    let isBoxEnabled = props.isEnabled;
    if (isBoxEnabled == undefined) {
        isBoxEnabled = true;
    }

    const onSelect = (value, text) => {
        // Regex parses '{EmployeeName} ({EmployeeId})'
        const selectedMatches = text.match(/(.*)\s\((\d*)\)*/);
        if (selectedMatches != null) {
            const [, fullName, id] = selectedMatches;
            selectedEmployee = {
                id,
                fullName
            };
        }

        /*****CPP 7587 start****/
        if (selectedEmployee !== undefined) {
            props.onSelect(selectedEmployee);

            selectedEmployee = undefined;
            $(`#${comboBoxId}`).data('kendoComboBox').text('');
            $(`#${comboBoxId}`).data('kendoComboBox')._old = '';
        }
        /*****CPP 7587 end****/

    };

    const selectEmployee = (event) => {
        event.preventDefault();

        if (selectedEmployee !== undefined) {
            props.onSelect(selectedEmployee);
            selectedEmployee = undefined;

            var comboBox = $(`#${comboBoxId}`).data('kendoComboBox');
            comboBox.text('');
            comboBox._old = '';
        }
    };

    const empPckrStyle = { display: 'none' };

    return (
        <div className="form-group">
            <ComboBox
                id={comboBoxId}
                name={comboBoxId}
                onSelect={onSelect}
                url="/Authors/GetEmployees"
                dataTextField="DisplayText"
                dataValueField="EmployeeId"
                placeholder="Search employee by name..."
                isEnabled= {isBoxEnabled}
                />
        </div>
    );
};

export default EmployeePicker;