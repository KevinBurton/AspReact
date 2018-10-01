module Gartner {
	export class EmployeeViewModel {
		private modalSelector: string;
		public selectedEmployees = ko.observableArray<Models.Employee>();
		public selectedEmployee = ko.observable();
		private employeeInputId = "add-employee";
		private employeeToAdd: Models.Employee;
		private canAddEmployee = ko.observable<boolean>(false);
		private sectionType = ko.observable<string>();
		private heading = ko.observable<string>();
		private caption = ko.observable<string>();
		private id: string;

		constructor(modalSelector: string, sectionType : string ,heading : string, caption: string, employees) {
			this.modalSelector = modalSelector;
			this.selectedEmployees = employees;
			this.employeeInputId = "add-employee" + sectionType;
			this.sectionType(sectionType);
			this.heading(heading);
			this.caption(caption);
			this.selectedEmployee.subscribe(this.onSelectEmployee);
			this.clearEmployeeInformation();

		}

		onReady() {
			this.clearEmployeeInformation();
			ko.applyBindings(this, document.getElementById(this.modalSelector));
			
		}

		onSelectEmployee = (newValue: any) => {
			if (!newValue) return;

			if (isNaN(newValue)) return;
			var valueAsInt = parseInt(newValue, 10);

			var authorAlreadyExists = this.selectedEmployees().filter((s: Models.Employee) => {
				return (s.isEmployeeWithEmployeeId(valueAsInt));
			}).length > 0;

			if (authorAlreadyExists) return;

			if (valueAsInt) {
				AuthorService.getEmployeeDetailByEmployeeId(valueAsInt)
					.done(response => {
						var typeValue = +this.sectionType();
						this.employeeToAdd = new Models.Employee(0, response, valueAsInt, typeValue);
						this.canAddEmployee(true);

					});
			} else {
				this.canAddEmployee(false);
			}
		}

		addEmployee = () => {
			if (this.canAddEmployee()) {
				this.selectedEmployees.push(this.employeeToAdd);
				this.clearEmployeeInformation();
			}
		}

		removeEmployee = (employee: Models.Employee) => {
			this.selectedEmployees.remove(employee);
		}
		clearEmployeeInformation = () => {
			this.canAddEmployee(false);
			this.selectedEmployee(undefined);
			this.employeeToAdd = null;
			var comboBox = $("#" + this.employeeInputId).data("kendoComboBox");
			if (comboBox) {
				comboBox.destroy();
			}
			this.initEmployeeComboBox();
		}
	
		initEmployeeComboBox() {
			$("#" + this.employeeInputId).kendoComboBox(<any>{
				dataSource: DocumentInformationService.getAuthorsComboBoxDataSource(this.employeeInputId),
				dataTextField: "DisplayText",
				delay: 400,
				filter: "contains",
				minLength: 1,
				autoBind: false,
				dataValueField: "EmployeeId",
				highlightFirst: true,
				value: this.selectedEmployee(),
				placeholder: "search employee by name..."
			});
		}
	}
} 