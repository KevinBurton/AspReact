module Gartner.RoleService {
	export interface RoleResponse {
		RoleId: number;
		RoleName: string;
		SortOrder?: number;
		Selected: boolean;
	}

	export function getRolesByAgendaId(agendaId: number): JQueryPromise<Array<RoleViewModel>> {
		return ServiceUtilities.get<Array<RoleResponse>>("/DocumentAgenda/GetRolesByAgendaId?agendaId=" + agendaId)
			.then(roles => toRoleViewModels(roles));
	}

	export function toRoleViewModels(responses: Array<RoleResponse>): Array<RoleViewModel> {
		return responses.map(res => new RoleViewModel(res.RoleId, res.RoleName, res.Selected));
	}

	export function toRoleResponses(viewModels: Array<RoleViewModel>): Array<RoleResponse> {
		return viewModels.map(vm => {
			return {
				RoleId: vm.id,
				RoleName: vm.text(),
				Selected: vm.selected()
			};
		});
	}
} 