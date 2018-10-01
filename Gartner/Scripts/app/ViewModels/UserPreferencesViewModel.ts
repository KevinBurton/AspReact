module Gartner {
    import Employee = Gartner.Models.Employee;

    export interface IUserPreferencesOptions {
		userFullName: string;
		userEmployeeId: number;
		currentDateTime: string;
	}
	

	export class UserPreferencesViewModel {
		id: number;
		delegates: Array<Employee>;
		userFullName: string;
		userEmployeeId: number;
		currentDateTime: string;
		saveData: IUserPreferences;

		selectedTrackManagers = ko.observableArray<Models.Employee>();
		selectedConferenceChairs = ko.observableArray<Models.Employee>();
		selectedEventPMs = ko.observableArray<Models.Employee>();		
		selectedReviewers = ko.observableArray<Models.Employee>();
		selectedTeamManagers = ko.observableArray<Models.Employee>();
		selectedPeerReviewers = ko.observableArray<Models.Employee>();
		selectedCoAuthors = ko.observableArray<Models.Employee>();
		preferences = ko.observableArray<UserPreference>();
		private isSaving = ko.observable<boolean>(false);
		
		//ko computed
		private canSave: any;
		onReady(options: IUserPreferencesOptions) {
			
			this.userFullName = options.userFullName;
			this.userEmployeeId = options.userEmployeeId;
			this.currentDateTime = options.currentDateTime;
			this.canSave = ko.computed<boolean>(() => this.getCanSave(this.isSaving()));
			setTimeout(() => this.getUserPreference(this.userEmployeeId), 1);
			ko.applyBindings(this, document.getElementById("user-preferences"));
		}

		getUserPreference(userId : number) {
			UserPreferencesService.getPreferencesByUserId(userId)
				.done(preference => {
					this.saveData = preference;
					this.from(preference);
				});
		}

		getCanSave(isSaving: boolean): boolean {
			return !isSaving;
		}

		onCancelClick() {
			this.from(this.saveData);
		}
        save = () => {

            this.delegates = new Array<Employee>();
            this.selectedConferenceChairs().forEach(x => this.delegates.push(x));
            this.selectedTrackManagers().forEach(x => this.delegates.push(x));
            this.selectedEventPMs().forEach(x => this.delegates.push(x));
            this.selectedReviewers().forEach(x => this.delegates.push(x));
            this.selectedTeamManagers().forEach(x => this.delegates.push(x));
            this.selectedPeerReviewers().forEach(x => this.delegates.push(x));
            this.selectedCoAuthors().forEach(x => this.delegates.push(x));

            var list = this.delegates.map(emp => emp.toJson());

			var json = <IUserPreferences> {
				'UserId': this.userEmployeeId,
                'UserDelegateViewModels': list
			};

			this.isSaving(true);
			UserPreferencesService.savePreferences(this.userEmployeeId, JSON.stringify(json))
				.done((response) => {
					if (response.exceptionMessage) {
						ErrorUtilities.showErrorFromResponse(response);
						return;
					}
					this.saveData = json;
					toastr.success("Preference Saved");
				})
				.always(() => this.isSaving(false));
		}

		from(response: IUserPreferences) {
			this.saveData = response;
			this.userEmployeeId = (response.UserId === 0 ? this.userEmployeeId : response.UserId) ;
			this.id = response.Id;
            if (response.UserDelegateViewModels !== undefined) {
                this.populateEmployee(response.UserDelegateViewModels, DelegateType.ConferenceChair, this.selectedConferenceChairs);
                this.populateEmployee(response.UserDelegateViewModels, DelegateType.EventPM, this.selectedEventPMs);
                this.populateEmployee(response.UserDelegateViewModels, DelegateType.TrackManager, this.selectedTrackManagers);
                this.populateEmployee(response.UserDelegateViewModels, DelegateType.MandatoryReviewer, this.selectedReviewers);
                this.populateEmployee(response.UserDelegateViewModels, DelegateType.TeamManager, this.selectedTeamManagers);
                this.populateEmployee(response.UserDelegateViewModels, DelegateType.PeerReviewer, this.selectedPeerReviewers);
                this.populateEmployee(response.UserDelegateViewModels, DelegateType.CoAuthor, this.selectedCoAuthors);
			}
			
        }

        populateEmployee(userDelegateViewModel: Array<IEmployee>,
            filterType: DelegateType,
            observable) {
            var employees = userDelegateViewModel.filter(x => x.TypeId === filterType)
                .map((delegate) => {
                    var employee = new Models.Employee(delegate.Id,
                        delegate.EmployeeName,
                        delegate.EmployeeId,
                        filterType);
                    return employee;
                });
            observable(employees);
        }
	}
} 