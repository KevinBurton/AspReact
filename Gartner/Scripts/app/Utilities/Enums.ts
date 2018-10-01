module Gartner {
    export enum ObjectStateEnum {
        Unchanged,
        Added,
        Modified,
        Deleted
    };
    export enum AuthorType {
        Primary = 1,
        CoAuthor = 2
    }
    export enum ReviewerType {
        Peer = 1
    }
    export enum Action {
        Create = 1,
        Edit = 2,
        Reply = 3
    }
    export enum FlagType {
        Red = 1,
        Green = 2
    }
    export enum SectionType {
        MandatoryReviewer = 1,
        TeamManager = 2
    }
    export enum SupportTeamType {
        Translator = 1,
        TranslatorReviewer = 2,
        TranslatorProofReader = 3,
        TranslatorFle = 4,
        Editor = 5,
        PreEditor = 6,
        Writer = 7,
        ProofReader = 8,
        GraphicDesigner = 9
    }
    export enum DelegateType {
        TeamManager = 1,
        PeerReviewer = 2,
        CoAuthor = 3,
        MandatoryReviewer = 4,
        ConferenceChair = 5,
        EventPM = 6,
        TrackManager = 7,
    }

}