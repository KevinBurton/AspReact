import * as React from 'react';
import EmployeePicker from './EmployeePicker';

const UserPreferencesUserSwitcher = () => {
	const changeUrl = (employeeId: number) => {
		window.location.href = `/UserPreferences/Details/${employeeId}`;
	};

	return (
		<div>
			View Preferences for Someone Else:
			<div>
				<EmployeePicker
			id="userSwitcherEmployeePicker"
			buttonText="Change"
			onSelect={(employee) => changeUrl(employee.id)}
			/>
			</div>
		</div>
	);
};

export default UserPreferencesUserSwitcher;