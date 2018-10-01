import * as React from 'react';
import objectAssign from '../../utils/objectAssign';

export interface RatingProps {
	isDisabled: boolean;
	rating?: number;
	onSelected: (rating: number) => void;
}

const Rating = React.createClass<RatingProps, any>({
	getInitialState() {
		return {
			hoveredRating: undefined
		}
	},

	render() {
		const { hoveredRating } = this.state;

		const numberOfStars = hoveredRating
			? hoveredRating
			: (this.props.rating || 0);

		return (
			<div className="rating">
				{[1, 2, 3, 4, 5].map(currentRating => (
					<Star
						key={currentRating}
						number={currentRating}
						isFilled={!this.props.isDisabled && currentRating <= numberOfStars}
						isDisabled={this.props.isDisabled}
						onClick={(rating) => this.onSelected(rating)}
						onHover={(rating) => this.setState({ hoveredRating: rating })}
						onHoverDone={() => this.setState({ hoveredRating: undefined })}
						/>
				))}
			</div>
		);
	},

	onSelected(rating: number) {;
		const ratingChanged = this.props.rating !== rating;

		if (!this.props.isDisabled && ratingChanged) {
			this.props.onSelected(rating);
		}
	}
});

const Star = ({number, isFilled, isDisabled, onClick, onHover, onHoverDone}) => {
	const additionalStarCssClasses = [];
	if (!isFilled) {
		additionalStarCssClasses.push('-empty');
	}
	if (isDisabled) {
		additionalStarCssClasses.push('-gray');
	}

	return (
		<span
			onClick={() => onClick(number)}
			onMouseOver={() => !isDisabled && onHover(number)}
			onMouseOut={() => !isDisabled && onHoverDone()}
			className={`glyphicon glyphicon-star${additionalStarCssClasses.join('')} ${number}-star`}>
		</span>
	);
}

export default Rating;