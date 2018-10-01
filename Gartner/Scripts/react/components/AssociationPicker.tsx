import * as React from 'react';

import AssociationType from '../enums/AssociationTypeEnum';
import CheckBox from './CheckBox';
import RadioGroup from './RadioGroup';
import { RadioGroupButtonProps } from './RadioGroupButton';

export interface AssociationPickerProps {
	disabledAssociations?: AssociationType[];
	selectedAssociation?: AssociationType;
	onAssociationSelected: (associationType: AssociationType) => void;
}

export interface AssociationPickerState {
	associations: any[];
	isTranslation: boolean;
	selectedAssociation: AssociationType;
}

const AssociationPicker = React.createClass<AssociationPickerProps, AssociationPickerState>({

	getInitialState() {
		const { isTranslation, selectedAssociation } = this.getDefaultAssociationOptions(this.props.selectedAssociation);

		return {
			associations: [
				{
					id: AssociationType.DirectPickUp,
					text: 'Direct Pick-Up',
					description: `I am not making any changes to the presentation file, but I can make metadata updates 
						(title, presenter, event, etc.). DPUs have an expedited workflow with no peer or mandatory review 
						or management review.`
				},
				{
					id: AssociationType.Modified,
					text: 'Modification',
					description: `I will be making changes to the presentation file and metadata (title, presenter, event, 
						etc.) the file will be going through peer review, mandatory review and management review.`
				}
			],
			isTranslation,
			selectedAssociation
		};
	},

	componentWillReceiveProps(nextProps) {
		this.setState(this.getDefaultAssociationOptions(nextProps.selectedAssociation));
	},

	getDefaultAssociationOptions(selectedAssociation: AssociationType) {
		let isTranslation = false;
		let nextAssociation = AssociationType.DirectPickUp;

		if (selectedAssociation) {
			switch (selectedAssociation) {
				case AssociationType.TranslationDirectPickUp:
					nextAssociation = AssociationType.DirectPickUp;
					isTranslation = true;
					break;
				case AssociationType.TranslationModified:
					nextAssociation = AssociationType.Modified;
					isTranslation = true;
					break;
				default:
					nextAssociation = selectedAssociation;
					isTranslation = false;
					break;
			}
		}

		return {
			selectedAssociation: nextAssociation,
			isTranslation
		};
	},

	onSelection(association: AssociationType) {
		this.setState({
			selectedAssociation: association
		}, () => this.propagateSelectedAssociation());
	},

	onTranslationToggled() {
		this.setState({
			isTranslation: !this.state.isTranslation
		}, () => this.propagateSelectedAssociation());
	},

	propagateSelectedAssociation() {
		let selectedAssociation: AssociationType;
		if (this.state.isTranslation) {
			switch (this.state.selectedAssociation) {
				case AssociationType.DirectPickUp:
					selectedAssociation = AssociationType.TranslationDirectPickUp;
					break;
				case AssociationType.Modified:
					selectedAssociation = AssociationType.TranslationModified;
					break;
				default:
					selectedAssociation = this.state.selectedAssociation;
					break;
			}
		} else {
			selectedAssociation = this.state.selectedAssociation;
		}

		this.props.onAssociationSelected(selectedAssociation);
	},

	getDisabledOptions(disabledAssociations: AssociationType[]) {
		let disabledRadioOptions = [];
		let translationIsDisabled = false;

		if (disabledAssociations && disabledAssociations.length > 0) {
			if (disabledAssociations.indexOf(AssociationType.DirectPickUp) > -1) {
				disabledRadioOptions.push(AssociationType.DirectPickUp);
			}
			if (disabledAssociations.indexOf(AssociationType.Modified) > -1) {
				disabledRadioOptions.push(AssociationType.Modified);
			}

			if (this.state.selectedAssociation === AssociationType.DirectPickUp &&
				disabledAssociations.indexOf(AssociationType.TranslationDirectPickUp) > -1) {
				translationIsDisabled = true;
			}
			else if (this.state.selectedAssociation === AssociationType.Modified &&
				disabledAssociations.indexOf(AssociationType.TranslationModified) > -1) {
				translationIsDisabled = true;
			}
		}
		return { disabledRadioOptions, translationIsDisabled };
	},

	render() {
		const { disabledRadioOptions, translationIsDisabled } = this.getDisabledOptions(this.props.disabledAssociations);
		return (
			<div>
				<div className="modal-content-block">
					<h5>Association to Parent</h5>
					<RadioGroup
						disabledOptions={disabledRadioOptions}
						onSelected={this.onSelection}
						radioButtonsProps={this.state.associations}
						selectedOption={this.state.selectedAssociation}
						/>
				</div>
				<div className="modal-content-block">
					<h5>Translation</h5>
					<CheckBox isChecked={this.state.isTranslation} isDisabled={translationIsDisabled} onChange={this.onTranslationToggled}>
						This session requires translation.
					</CheckBox>
				</div>
			</div>
		);
	}
});

export default AssociationPicker;