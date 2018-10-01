 module Gartner {

	 export interface ReceiveAllResponse {
		 SpeakersOutsideEvent?: Array<ProposedSpeakerResponse>;
		 ExternalSpeakers?:Array<ExternalSpeakerResponse>;
		 ParentItem: ParentItemResponse;
		 Events: Array<FullEventResponse>;

		 CanHaveMultipleEvents: boolean;
		 CanUpdateTracks: boolean;
		 CanAddEvents: boolean;
         CanRemoveEvent: boolean;
         CanRemoveTracks: boolean;
	 }

	 export interface ParentItemResponse {
		 Relationship: string;
		 Title: string;
		 ItemId: number;
		 PrimaryAuthor: string;
		 CoAuthors: Array<string>;
		 Event: EventResponse;
	 }

	 export interface EventResponse {
		 Id?: number; // item details id
		 EventId: number;
		 Code: string;
		 Title: string;
		 FormattedStartDate: string;
		 Region: string;
		 ConferenceChair: string;
         StartDate?: string;
     }

	 export interface FullEventResponse extends EventResponse {
		 IsParent: boolean;
		 RelationshipTypeId?: number;
		 Speakers: Array<ProposedSpeakerResponse>;
		 ExternalSpeakers: Array<ExternalSpeakerResponse>;
         SpeakerRoles: Array<SpeakerRole>;
		 Tracks: Array<TrackResponse>; // for multi track support
		 AllTracks: Array<TrackResponse>;
	 }

	 export interface TrackResponse {
		 TrackId: number;
		 Code: string;
		 Title: string;
		 TrackManager: string;
		 DisplayText?: string;
	 }

	 export interface ProposedSpeakerResponse {
		 EmployeeId?: number;
         SpeakerName: string;
         SpeakerRole: SpeakerRole;
       
	 }

	 export interface ExternalSpeakerResponse {
		 SpeakerName : string;
	 }

	 export interface GetEventAndTracksResponse {
		 Event: EventResponse;
		 Tracks: Array<TrackResponse>;
     }

     export  interface  SpeakerRole  {          RoleId:  number;          RoleDescription:  string;     }
 }