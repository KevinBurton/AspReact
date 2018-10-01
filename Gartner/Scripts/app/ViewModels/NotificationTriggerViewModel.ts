module Gartner {

    export class NotificationTriggerViewModel {
        public ActivityId: number;
        public WorkflowId: number;
        public WorkflowStageId: number;
        constructor(json: { ActivityId: number, WorkflowId: number, WorkflowStageId: number }) {
            this.ActivityId = json.ActivityId;
            this.WorkflowId = json.WorkflowId;
            this.WorkflowStageId = json.WorkflowStageId;
        }
    }
}