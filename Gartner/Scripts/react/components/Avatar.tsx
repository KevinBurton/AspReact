import * as React from 'react';
import classNames from '../utils/classnames';

export interface AvatarProps {
	employeeId: number | string;
	useBlockDisplay?: boolean;
}

const Avatar = (props: AvatarProps) => {

	const avatarClasses = classNames({
		'pull-left': true,
		'avatar-block': props.useBlockDisplay
	});

	return (
		<div className={avatarClasses}>
			<img width="40" height="40" alt="Avatar" className="media-object avatar" src={`/EmployeeAvatar/Thumbnail/${props.employeeId}`} />
		</div>
	);
};

export default Avatar;