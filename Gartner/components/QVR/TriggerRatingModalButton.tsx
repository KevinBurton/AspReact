import * as React from 'react';
import { Qvr } from '../../models/qvr';

export interface TriggerRatingModalButtonProps {
	qvr?: Qvr;
	onClick: Function;
}

const TriggerRatingModalButton = (props: TriggerRatingModalButtonProps) => {
	const hasQvr = !!props.qvr;
	return (
		<a href="#" onClick={(event) => event.preventDefault() || props.onClick()}>
			<i className={hasQvr ? 'icon-rating-notes-filled' : 'icon-rating-notes-empty'}></i>
		</a>
	);
};

export default TriggerRatingModalButton;