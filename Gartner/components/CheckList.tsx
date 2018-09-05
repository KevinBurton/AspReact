import * as React from 'react';

export interface CheckListProps {
	children?: any;
	title: string;
};

const CheckList = (props: CheckListProps) => {
	return (
        <div className="row">
            <div className="col-md-12">
                <h5>{props.title}</h5>
                <ul className="list-unstyled">
			        {props.children}
                </ul>
            </div>
        </div>
	);
};

export default CheckList;
