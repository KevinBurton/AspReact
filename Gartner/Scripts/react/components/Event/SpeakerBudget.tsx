import * as React from 'react';
import objectAssign from '../../utils/objectAssign';
import Form = require("../Form");
import {SpeakerScore} from '../../models/eov';

export interface SpeakerBudgetProps {
	speakerScoreCollection?: Array<SpeakerScore>;
	valueChange: (score: number, speakerScore: SpeakerScore) => void;
}

export const SpeakerBudget = React.createClass<SpeakerBudgetProps, any>({
	render() {
		return (
			<div className="table-responsive">
				<table className="table table-bordered table-striped table-condensed">
					<thead>
						<tr>
							{
								this.props.speakerScoreCollection.map
									(speakerScore =>
									(<th className="text-center">{speakerScore.RegionName}</th>)
									)
							}
							<th className="text-center font-bold">Total</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							{
								this.props.speakerScoreCollection.map
									(speakerScore =>
									(<td className="text-center" key={speakerScore.RegionId}>
											<Form.InputNumber
											key={speakerScore.RegionId}
											name={speakerScore.RegionName}
											id={speakerScore.RegionId}
											value={speakerScore.SpeakerCount}
											onChange={(e) => this.props.valueChange(e, speakerScore)} />
										</td>)
									)
							}
							<td className="text-center vmiddle font-bold total-bg-color">{this.renderTotal(this.props.speakerScoreCollection)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	},

	renderTotal(speakerScoreCollection) {
		var scoreTotal: number = 0;
		for (var x = 0; x < speakerScoreCollection.length; x++) {
			var currentItem = speakerScoreCollection[x];
			scoreTotal += parseInt(currentItem.SpeakerCount as string);
		}
		return scoreTotal;
	}
});


export default SpeakerBudget;