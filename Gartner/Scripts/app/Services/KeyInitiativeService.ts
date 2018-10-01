module Gartner.KeyInitiativeService {
	export enum KeyInitiativeType {
		Primary = 0,
		Secondary
	}

	export interface KeyInitiativeResponse {
		KeyInitiativeId: number;
		KeyInitiativeName: string;
		KeyInitiativeType?: KeyInitiativeType;
		Phases?: Array<PhaseResponse>;
	}

	export interface PhaseResponse {
		Id: number;
		Name: string;
		Selected: boolean;
		SortOrder?: number;
	}

	export function getKeyInitiativesByAgendaId(agendaId: number): JQueryPromise<Array<KeyInitiativeViewModel>> {
		return ServiceUtilities.get<Array<KeyInitiativeResponse>>("/DocumentAgenda/GetKeyInitiativesByAgendaId?agendaId=" + agendaId)
			.then((keyInitiatives) => {
				return toKeyInitiativeViewModels(keyInitiatives);
			});
	}

	export function toKeyInitiativeViewModels(keyInitiativeResponses: Array<KeyInitiativeResponse> = []): Array<KeyInitiativeViewModel> {
		return keyInitiativeResponses.map(ki => new KeyInitiativeViewModel(
				ki.KeyInitiativeId,
				ki.KeyInitiativeName,
				ki.KeyInitiativeType === KeyInitiativeType.Primary,
				ki.Phases ? toPhaseViewModels(ki.Phases) : []
			));
	}

	export function toKeyInitiativeResponses(keyInitiatives: Array<KeyInitiativeViewModel> = []): Array<KeyInitiativeResponse> {
		return keyInitiatives.map(x => {
			return {
				KeyInitiativeId: x.id,
				KeyInitiativeName: x.name,
				KeyInitiativeType: x.primary() ? KeyInitiativeType.Primary : KeyInitiativeType.Secondary,
				Phases: toPhaseResponses(x.phases())
			};
		});
	}

	function toPhaseViewModels(phaseReponses: Array<PhaseResponse>): Array<PhaseViewModel> {
		return phaseReponses.map(x => new PhaseViewModel(x.Id, x.Name, x.SortOrder, x.Selected || false));
	}

	function toPhaseResponses(phaseViewModels: Array<PhaseViewModel>): Array<PhaseResponse> {
		return phaseViewModels.map(x => {
			return {
				Id: x.id,
				Name: x.text,
				Selected: x.selected()
			}
		});
    }

    export function getKeyInitiativeById(keyInitiativeId: number): JQueryPromise<Object> {
        return $.ajax({
            url: "/api/KeyInitiative/" + keyInitiativeId,
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }
} 