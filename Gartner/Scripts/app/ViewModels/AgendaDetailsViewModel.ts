module Gartner {

    export class AgendaDetailsViewModel {

        public Id: number;
        public Name: string;
        public StatusId: string;
        public AgendaManager: AgendaDetailsViewModel.EmployeeViewModel;
        public ChiefOfResearch: AgendaDetailsViewModel.EmployeeViewModel;
        public BackupManagers: Array<AgendaDetailsViewModel.EmployeeViewModel>;
        public KeyInitiatives: Array<KeyInitiativeViewModel>;
        public RefinementTopics: Array<AgendaDetailsViewModel.RefinementTopicViewModel>;
        public Roles: Array<AgendaDetailsViewModel.RoleViewModel>;
        public ContentTypeExclusion: Array<AgendaDetailsViewModel.ContentTypeExcludeViewModel>;
    }

    export module AgendaDetailsViewModel {

        export class EmployeeViewModel {
            public Id: string;
            public LastFirstName: string;
            constructor(json: { Id: string, LastFirstName: string }) {
                this.Id = json.Id;
                this.LastFirstName = json.LastFirstName;
            }
        }

        export class RefinementTopicViewModel {
            public Id: string;
            public Name: string;
            public ClientQuestions: Array<ClientQuestionViewModel>;
            constructor(json: { Id: string, Name: string, ClientQuestions: Array<ClientQuestionViewModel> }) {
                this.Id = json.Id;
                this.Name = json.Name;
                this.ClientQuestions = json.ClientQuestions;
            }
        }

        export class ClientQuestionViewModel {
            public Id: string;
            public Name: string;
            constructor(json: { Id: string, Name: string }) {
                this.Id = json.Id;
                this.Name = json.Name;
            }
        }

        export class KeyInitiativeViewModel {
            public Id: string;
            public Name: string;
            constructor(json: { Id: string, Name: string }) {
                this.Id = json.Id;
                this.Name = json.Name;
            }
        } 

        export class RoleViewModel {
            public Id: string;
            public Name: string;
            public IsActive: boolean;
            constructor(json: { Id: string, Name: string, IsActive: string }) {
                this.Id = json.Id;
                this.Name = json.Name;
                this.IsActive = (json.IsActive.toLowerCase() == "true") ? true : false;
            }
        } 
        export class ContentTypeExcludeViewModel {
            public ContentTypeId: string;
            public ContentSubtypeId: string;
            constructor(json: { ContentTypeId: string, ContentSubtypeId: string }) {
                this.ContentTypeId = json.ContentTypeId;
                this.ContentSubtypeId = json.ContentSubtypeId;
            }
        } 
    }
} 