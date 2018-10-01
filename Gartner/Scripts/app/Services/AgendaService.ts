module Gartner.AgendaService {
	//used to keep track of what is currently in the db
	var dbAgendas: Array<AgendaResponse> = [];

	enum AgendaType {
		Primary = 0,
		Secondary
	}

	interface AgendaResponse {
		Id?: number;
		AgendaId: number;
		AgendaName?: string;
		AgendaType: AgendaType;
		CreatedTimeUtc: string;
		CreatedTimeIso?: string;
		CreatedByEmployeeId: number;
		ObjectState?: ObjectStateEnum;
		KeyInitiatives?: Array<KeyInitiativeService.KeyInitiativeResponse>;
		Roles?: Array<RoleService.RoleResponse>;
	}
	
	export function getAgendasComboBoxDataSource() {
		return ServiceUtilities.getComboBoxDataSource("/DocumentAgenda/GetCPPAgendas/");
	}

	export function getAgendasByItemId(itemId: number): JQueryPromise<Array<AgendaViewModel>> {
		return ServiceUtilities.get<Array<AgendaResponse>>("/DocumentAgenda/GetAgendasByItemId/" + itemId)
			.then((agendas) => {
				dbAgendas = agendas;
				return toAgendaViewModels(agendas);
			});
	}

	function toAgendaViewModels(response: Array<AgendaResponse> = []): Array<AgendaViewModel> {
		return response.map(agenda => {
			return new AgendaViewModel({
				id: agenda.Id,
				agendaId: agenda.AgendaId,
				name: agenda.AgendaName,
				primary: agenda.AgendaType === AgendaType.Primary,
				createdTimeUtc: agenda.CreatedTimeIso,
				createdByEmployeeId: agenda.CreatedByEmployeeId,
				keyInitiatives: KeyInitiativeService.toKeyInitiativeViewModels(agenda.KeyInitiatives),
				roles: RoleService.toRoleViewModels(agenda.Roles)
			});
		});
	}

	function toAgendaResponses(agendas: Array<AgendaViewModel> = []): Array<AgendaResponse> {
		return agendas.map((agenda) => {
			return {
				Id: agenda.id,
				AgendaId: agenda.agendaId,
				AgendaName: agenda.name,
				AgendaType: agenda.primary
					? AgendaType.Primary
					: AgendaType.Secondary,
				CreatedTimeUtc: agenda.createdTimeUtc,
				CreatedByEmployeeId: agenda.createdByEmployeeId,
				KeyInitiatives: KeyInitiativeService.toKeyInitiativeResponses(agenda.keyInitiatives()),
				Roles: RoleService.toRoleResponses(agenda.roles())
			};
		});
	}

	export function save(itemId: number, agendas: Array<AgendaViewModel> = []): JQueryPromise<Array<AgendaViewModel>> {
		if (!isValid(agendas)) {
			return $.Deferred().reject("Primary key initiative should have a phase");
		}

		var clientAgendas = toAgendaResponses(agendas);

		var toSave = DiffUtilities.compareToGetObjectState({
			clientArray: clientAgendas,
			dbArray: dbAgendas,
			propertiesThatIndicateUnique: ["AgendaId"],
			propertiesThatIndicateChanged: ["AgendaId", "AgendaType"]
		});

		return ServiceUtilities.post<Array<AgendaResponse>>("/DocumentAgenda/Upsert/" + itemId, JSON.stringify(toSave))
			.then((savedAgendas) => {
				dbAgendas = savedAgendas;
				if (Array.isArray(savedAgendas)) {
					return toAgendaViewModels(savedAgendas);
				} else {
					return [];
				}
			});
	}

	function isValid(agendas: Array<AgendaViewModel>) {
		var valid = true;

		agendas.forEach(agenda => {
			var primaryKeyInitiative = agenda.keyInitiatives().filter(ki => ki.primary());
			if (primaryKeyInitiative.length) {
				var phaseCount = primaryKeyInitiative[0].phases().filter(ph => ph.selected()).length;
				if (phaseCount === 0) {
					valid = false;
				}
			}
		});

		return valid;
	}
} 