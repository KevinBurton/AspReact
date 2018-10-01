import * as React from 'react';
import objectAssign from '../../utils/objectAssign';
import Form = require("../Form");
import { TrackScScore } from '../../models/eov';

export interface TrackBudgetProps {
	trackScCollection?: TrackScScore[][];
	tscValueChange: (categoryCount: number, trackColumn: TrackScScore) => void;
};
export const TrackBudget = React.createClass<TrackBudgetProps, any>({

	render() {

		const totalTracks: number = this.props.trackScCollection.length;
		const displayTracks = totalTracks > 0;
		const firstTrack = this.props.trackScCollection[0];
		const grandTotal: number = 0;
		
		return (

			<div className="table-responsive">
				<table className="table table-bordered table-striped table-condensed">
					<thead>
						<tr>
							<th className="text-center"></th>
							{displayTracks
								? firstTrack.map(x => {
									return (<th className="text-center">{x.SessionCategoryName}</th>);
								})
								: ''
							}
							<th className="text-center font-bold">Total</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="text-left font-bold total-bg-color">Summary</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[0]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[1]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[2]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[3]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[4]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[5]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[6]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[7]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderCategoryTotal(this.props.trackScCollection.map(x => x[8]))}</td>
							<td className="text-center font-bold total-bg-color">{this.renderGrandTotal(this.props.trackScCollection)}</td>
						</tr>
						{
							this.props.trackScCollection.map(trackRow => {
								return (<tr>
									<td className="text-left">{trackRow[0].TrackTitle as string}</td>
									{
										trackRow.map((trackColumn, index) =>
											(<td className="text-center">
												<Form.InputNumber
													key={`track-${trackColumn.TrackId}-ix-${index}`}
													name={trackColumn.SessionCategoryName}
													id={trackColumn.SessionCategoryId}
													value={trackColumn.SessionCategoryCount}
													onChange={(e) => this.props.tscValueChange(e, trackColumn)}
													/></td>))
									}

									<td className="text-center vmiddle font-bold total-bg-color">{this.renderTrackTotal(trackRow)}</td>
								</tr>);
							})
						}

					</tbody>
				</table>
			</div>
		);
	},

	renderTrackTotal(track) {
		var trackTotal: number = 0;
		for (var x = 0; x < track.length; x++) {
			var currentTrack = track[x];
			trackTotal += parseInt(currentTrack.SessionCategoryCount as string);
		}
		return trackTotal;
	},

	renderCategoryTotal(trackCollection) {
		var categoryTotal: number = 0;
		var categoryCounts = [];
		for (var x = 0; x < trackCollection.length; x++) {
			categoryCounts.push(trackCollection[x].SessionCategoryCount as string);
		}
		for (var y = 0; y < categoryCounts.length; y++) {
			categoryTotal += parseInt(categoryCounts[y]);
			
		}
		return categoryTotal;
	},

	renderGrandTotal(trackCollection) {
		var grandTotal: number = 0;
		for (var y = 0; y < trackCollection.length; y++) {
			var currentCategory = trackCollection[y];
			for (var z = 0; z < currentCategory.length; z++) {
				grandTotal += parseInt(currentCategory[z].SessionCategoryCount as string);
			}
		}
		return grandTotal;
	}
});

export default TrackBudget;