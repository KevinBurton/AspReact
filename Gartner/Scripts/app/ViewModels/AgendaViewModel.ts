module Gartner {
	export interface AgendaViewModelOptions {
		id?: number;
		agendaId: number;
		name: string;
		primary: boolean;
		createdTimeUtc?: string;
		createdByEmployeeId?: number;
		keyInitiatives?: Array<KeyInitiativeViewModel>;
		roles?: Array<RoleViewModel>;
	}

	export class AgendaViewModel {
		id: number;
		agendaId: number;
		name: string;
		primary: boolean;
		createdTimeUtc: string;
		createdByEmployeeId: number;

		roles = ko.observableArray<RoleViewModel>([]);
		keyInitiatives = ko.observableArray<KeyInitiativeViewModel>();

		orderedKeyInitiatives: KnockoutComputed<Array<KeyInitiativeViewModel>>;

		constructor(options: AgendaViewModelOptions) {
			this.id = options.id;
			this.agendaId = options.agendaId;
			this.name = options.name;
			this.primary = options.primary;
			this.createdTimeUtc = options.createdTimeUtc;
			this.createdByEmployeeId = options.createdByEmployeeId;

			if (options.keyInitiatives !== undefined) {
				this.keyInitiatives(options.keyInitiatives);
			}

			if (options.roles !== undefined) {
				this.withRoles(options.roles);
			}

			this.orderedKeyInitiatives = ko.computed<Array<KeyInitiativeViewModel>>(() => this.getSortedKeyInitiatives(this.keyInitiatives()));
		}

		withKeyInitiatives(keyInitiatives: Array<KeyInitiativeViewModel>) {
			this.keyInitiatives(keyInitiatives);
			return this;
		}

		withRoles(roles: Array<RoleViewModel>) {
			if (roles.length === 1) {
				roles[0].selected(true);
			}

			this.roles(roles);
		}

		getSortedKeyInitiatives(keyInitiatives: Array<KeyInitiativeViewModel>): Array<KeyInitiativeViewModel> {
			var sortedSecondaryKis = keyInitiatives
				.filter(x => !x.primary())
				.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else {
						return 0;
					}
				});

			return keyInitiatives.filter(x => !!x.primary())
				.concat(sortedSecondaryKis);

		}

		makePrimary = (keyInitiative: KeyInitiativeViewModel) => {
			this.keyInitiatives().forEach(x => x.primary(false));
			keyInitiative.primary(true);
		}
	}
} 