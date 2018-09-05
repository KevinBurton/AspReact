export interface SpeakerScore {
	RegionId: number;
	RegionName: string;
	SpeakerCount: number;
}

export interface SessionCategoryScore {
	SessionCategoryId: number;
	SessionCategoryName: string;
	SessionCategoryCount: number;
}

export interface TrackScScore {
	TrackId: number;
	TrackTitle: string;
	SessionCategoryId: number;
	SessionCategoryName: string;
	SessionCategoryCount: number;
}


export interface EventOverviewCollections {
	EventSpeakerScoreCollection: SpeakerScore[];
	EventSessionCategoryCollection: SessionCategoryScore[];
	EventTrackScScoreCollection: TrackScScore[][];
}

