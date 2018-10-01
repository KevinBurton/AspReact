module Gartner {

    export class SeriesEventsDetailsViewModel {

        public Id: number;
        public Title: string;
        public StatusId: string;
        public ResearchLead: SeriesEventsDetailsViewModel.EmployeeViewModel;
        public ContentPlanner: SeriesEventsDetailsViewModel.EmployeeViewModel;
        public ConferenceChair: SeriesEventsDetailsViewModel.EmployeeViewModel;
        public EventManager: SeriesEventsDetailsViewModel.EmployeeViewModel;
       
    }

    export module SeriesEventsDetailsViewModel {

        export class EmployeeViewModel {
            public Id: string;
            public LastFirstName: string;
            constructor(json: { Id: string, LastFirstName: string }) {
                this.Id = json.Id;
                this.LastFirstName = json.LastFirstName;
            }
        }

    }
} 