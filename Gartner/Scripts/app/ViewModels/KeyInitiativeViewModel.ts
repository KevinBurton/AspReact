/// <reference path="../../typings/knockout/knockout.d.ts" />
module Gartner {
	export class KeyInitiativeViewModel {
		id: number;
		name: string;
		primary = ko.observable<boolean>();

		phases = ko.observableArray<PhaseViewModel>([]);
		orderedPhases: KnockoutComputed<Array<PhaseViewModel>>;
		phaseCount: KnockoutComputed<number>;

		constructor(id: number, name: string, primary: boolean, phases: Array<PhaseViewModel>) {
			this.id = id;
			this.name = name;
			this.primary(primary);

			if (phases) {
				this.phases(phases);	
			}

			this.phaseCount = ko.computed<number>(() => this.phases().filter(x => x.selected()).length);
			this.orderedPhases = ko.computed<Array<PhaseViewModel>>(() => this.sortPhases(this.phases()));
		}

		sortPhases(phases: Array<PhaseViewModel>): Array<PhaseViewModel> {
			return phases.sort((a, b) => {
				return a.sortOrder - b.sortOrder;
			});
		}
	}

	export class PhaseViewModel {
		id: number;
		text: string;
		sortOrder: number;
		selected = ko.observable<boolean>();

		constructor(id: number, text: string, sortOrder: number, selected: boolean) {
			this.id = id;
			this.text = text;
			this.sortOrder = sortOrder;
			this.selected(selected);
		}
	}
} 