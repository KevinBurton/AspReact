import * as React from 'react';
import objectAssign from '../../utils/objectAssign';
import Form = require("../Form");
import { SessionCategoryScore } from '../../models/eov';

export interface SessionCategoryBudgetProps {
	sessionCategoryCollection?: Array<SessionCategoryScore>;
	scValueChange: (categoryCount: number, categoryScore: SessionCategoryScore) => void;
}

export const SessionCategoryBudget = React.createClass<SessionCategoryBudgetProps, any>({
	render() {
		return (
			<div className="table-responsive">
				<table className="table table-bordered table-striped table-condensed">
					<thead>
						<tr>
							<th className="text-center"></th>
							{
								this.props.sessionCategoryCollection.map
									(categoryScore =>
									(<th className="text-center">{categoryScore.SessionCategoryName}</th>)
									)
							}
							<th className="text-center font-bold">Total</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="text-center">Inventory</td>
							{
								this.props.sessionCategoryCollection.map(categoryScore =>
									(<td className="text-center" key={categoryScore.SessionCategoryId}>
											<Form.InputNumber 
											key={categoryScore.SessionCategoryId}
											name={categoryScore.SessionCategoryName}
											id={categoryScore.SessionCategoryId}
											value={categoryScore.SessionCategoryCount}
											onChange={(e) => this.props.scValueChange(e, categoryScore)} />
										</td>)
									)
							}
							<td className="text-center vmiddle font-bold total-bg-color">{this.renderCategoryCount(this.props.sessionCategoryCollection)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	},

	renderCategoryCount(sessionCategoryCollection) {
		var categoryTotal: number = 0;
		for (var x = 0; x < sessionCategoryCollection.length; x++) {
			var currentItem = sessionCategoryCollection[x];
			categoryTotal += parseInt(currentItem.SessionCategoryCount as string);
		}
		return categoryTotal;
	}
});


export default SessionCategoryBudget;
