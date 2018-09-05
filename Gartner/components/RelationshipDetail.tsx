import * as React from 'react';
export interface RelationshipDetailProps {
	relationshipType: string;
	parentItemId: number;
}

const RelationshipDetail = (props: RelationshipDetailProps) => {
	if (props.parentItemId) {
		return (
			<span className="text-muted paddleft">
				This item is a {props.relationshipType} of <a href={"/Item/Details/" + props.parentItemId} target='_blank'>{props.parentItemId}</a>
			</span>
		);
	}
	return (<span></span>);
};

export default RelationshipDetail;