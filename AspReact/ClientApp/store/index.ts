import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';
import * as HlcDetail from './HlcDetail';
import * as TitleDescription from './TitleDescription'
import * as DownloadTemplateButton from './DownloadTemplateButton'
import * as ViewParentAssociationItemWorkFlowStage from './ViewParentAssociationItemWorkFlowStage'
import * as HlcItemStatusDatesComponent from './HlcItemStatusDatesComponent'

// The top-level state object
export interface ApplicationState {
    hlcItemStatusDatesComponent: HlcItemStatusDatesComponent.HlcItemStatusDatesComponentState;
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
    hlcItemStatusDatesComponent: HlcItemStatusDatesComponent.reducer,
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

