import * as React from 'react';

export interface AvatarProps {
	employeeId: number | string;
}

const Avatar = (props: AvatarProps) => {
	return (
		<img alt="Avatar" src={`/EmployeeAvatar/Thumbnail/${props.employeeId}`} className="media-object avatar"/>
	);
};

export default Avatar;