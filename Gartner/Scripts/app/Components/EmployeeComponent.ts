module Gartner {
	ko.components.register("employeecomponent", {
		viewModel: {
			createViewModel: function (params, componentInfo) {
				return new EmployeeViewModel(params.modalSelector, params.sectionType, params.heading, params.caption, params.employees);
			}
		},
		template: { fromUrl: 'Employee.html', maxCacheAge: 1234 }
	});

	ko.components.register("employeecontrol", {
		viewModel: {
			createViewModel: function (params, componentInfo) {
				var vm = new EmployeeViewModel(params.modalSelector, params.sectionType, params.heading, params.caption, params.employees);
				$(componentInfo.element).on('clearEmployeeInformation', () => {
					vm.clearEmployeeInformation();
				});
				return vm;
			}
		},
		template: { fromUrl: 'EmployeeControl.html', maxCacheAge: 1234 }
	});
}  