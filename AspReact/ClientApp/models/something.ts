export interface Something {
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
