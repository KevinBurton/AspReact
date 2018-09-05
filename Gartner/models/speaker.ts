
export interface SpeakersCollection {
    itemSpeakers: Speaker[];
}


export interface Speaker {
    Id: number;
	EmployeeId: number;
	EmployeeName: string;
    RoleId: number;
    RoleDescription: string;
    EventId: number;
    isEnabled: boolean; 
}


export interface SpeakerRole {

    RoleId: number;
    RoleDescription: string;
}

export interface SpeakerRoleOption {

    Value: string;
    Text: string;
}

export interface SpeakerRoleDDL {
    speakerRoles: SpeakerRoleOption[]
}



export interface SpeakerBench {
    ID: number;
    EmployeeId: number;
    EmployeeName: string;
}




