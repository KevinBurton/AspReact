module Gartner {

    export class NotificationDetailsViewModel {
        public Id: number;
        public Name: string;
        public TemplateModelTypeId: number;
        public StartTimestamp: string;
        public EndTimestamp: string;
        public Trigger: NotificationTriggerViewModel;
        constructor(json: { Id: number, Name: string, TemplateModelTypeId: number, StartTimestamp: string, EndTimestamp: string, Trigger: NotificationTriggerViewModel }) {
            this.Id = json.Id;
            this.Name = json.Name;
            this.TemplateModelTypeId = json.TemplateModelTypeId;
            this.StartTimestamp = json.StartTimestamp;
            this.EndTimestamp = json.EndTimestamp;
            this.Trigger = json.Trigger;
        }
    }

    export class EmailNotificationDetailsViewModel extends NotificationDetailsViewModel {
        public From: string;
        public To: Array<string>;
        public Cc: Array<string>;
        public Subject: string;
        public Body: string;
        constructor(json: { Base: NotificationDetailsViewModel, From: string, To: Array<string>, Cc: Array<string>, Subject: string, Body: string }) {
            super(json.Base);
            this.From = json.From;
            this.To = json.To;
            this.Cc = json.Cc;
            this.Subject = json.Subject;
            this.Body = json.Body;
        }
    }
}