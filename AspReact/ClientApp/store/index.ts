import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';
import * as HlcDetail from './HlcDetail';
import * as TitleDescription from './TitleDescription'
import * as DownloadTemplateButton from './DownloadTemplateButton'
import * as ViewParentAssociationItemWorkFlowStage from './ViewParentAssociationItemWorkFlowStage'
import * as HlcItemStatusDates from './HlcItemStatusDates'
import * as ReviewerBench from './ReviewerBench'
import * as OwnerBench from './OwnerBench'
import * as SpeakerBench from './SpeakerBench'
import * as SupportTeam from './SupportTeam'
import * as ResearchAgenda from './ResearchAgenda'
import * as Discussion from './Discussion'
import * as QVRBench from './QVRBench'
import * as EditorBench from './EditorBench'
import * as GraphicDesignerBench from './GraphicDesignerBench'
import * as HlcBasicInfo from './HlcBasicInfo'
import * as Comments from './Comments'
import * as HlcSessionFileDetails from './HlcSessionFileDetails'
import * as PQFModal from './PQFModal'

import {EventEmitter} from 'events'

// The top-level state object
export interface ApplicationState {
    itemId: number;
    eventEmitter: EventEmitter;
    reviewApproved: PQFModal.PQFModalState;
    hlcSessionFileDetails: HlcSessionFileDetails.HlcSessionFileDetailsState;
    comments: Comments.CommentsState;
    hlcBasicInfo: HlcBasicInfo.HlcBasicInfoState;
    graphicDesignerBench: GraphicDesignerBench.GraphicDesignerBenchState;
    editorBench: EditorBench.EditorBenchState;
    qvrBench: QVRBench.QVRBenchState;
    discussion: Discussion.DiscussionState;
    researchAgenda: ResearchAgenda.ResearchAgendaState;
    supportTeam: SupportTeam.SupportTeamState;
    speakerBench: SpeakerBench.SpeakerBenchState;
    ownerBench: OwnerBench.OwnerBenchState;
    reviewerBench: ReviewerBench.ReviewerBenchState;
    hlcItemStatusDates: HlcItemStatusDates.HlcItemStatusDatesState;
    viewParentAssociationItemWorkFlowStage: ViewParentAssociationItemWorkFlowStage.ViewParentAssociationItemWorkFlowStageState;
    downloadTemplateButton: DownloadTemplateButton.DownloadTemplateButtonState;
    titleDescription: TitleDescription.TitleDescriptionState;
    hlcDetail: HlcDetail.HlcDetailState;
    counter: Counter.CounterState;
    weatherForecasts: WeatherForecasts.WeatherForecastsState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    pqfModal: PQFModal.reducer,
    hlcSessionFileDetails: HlcSessionFileDetails.reducer,
    comments: Comments.reducer,
    hlcBasicInfo: HlcBasicInfo.reducer,
    graphicDesignerBench: GraphicDesignerBench.reducer,
    editorBench: EditorBench.reducer,
    qvrBench: QVRBench.reducer,
    discussion: Discussion.reducer,
    researchAgenda: ResearchAgenda.reducer,
    supportTeam: SupportTeam.reducer,
    speakerBench: SpeakerBench.reducer,
    ownerBench: OwnerBench.reducer,
    reviewerBench: ReviewerBench.reducer,
    hlcItemStatusDates: HlcItemStatusDates.reducer,
    viewParentAssociationItemWorkFlowStage: ViewParentAssociationItemWorkFlowStage.reducer,
    downloadTemplateButton: DownloadTemplateButton.reducer,
    titleDescription: TitleDescription.reducer,
    hlcDetail: HlcDetail.reducer,
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

