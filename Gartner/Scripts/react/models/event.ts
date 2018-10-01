import { SpeakersCollection } from '../models/speaker';

export interface EventsCollection {
    itemEvents: Event[];
}


export interface Event {
    Id: number;
    Code: string;
    Title: string;
    Region: string;
    FormattedStartDate: string;
    IsParent: boolean;
    EventId: number;
    ItemDetailId: number;
    IsSpeakerEnabled: boolean;
    Events: Event[];



}







