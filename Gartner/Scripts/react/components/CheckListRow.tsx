import * as React from 'react';

export interface CheckListRowProps {
	children?: any;
};

const CheckListRow = (props: CheckListRowProps) => {
	return (
			<li>{props.children}</li>
	);
};

export default CheckListRow;
