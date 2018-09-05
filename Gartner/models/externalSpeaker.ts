export interface ExternalSpeakersCollection {
    itemExternalSpeakers: ExternalSpeaker[];
}

export interface ExternalSpeaker
{
    Id: number;
    EmployeeId: number;
    NonEmployeeName: string;
    EventId: number; 
}


