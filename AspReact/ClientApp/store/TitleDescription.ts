import { Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface TitleDescriptionState {
    TitleDescription?: {
      Title: {
        IsRequired: boolean;
        Value: string;
        MaxLength: number;
      },
      Description: {
        IsRequired: boolean;
        Value: string;
        MaxLength: number;
      }
    };
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
interface RefreshTitleDescriptionAction { type: 'REFRESH_TITLE_DESCRIPTION' }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RefreshTitleDescriptionAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    refresh: () => <RefreshTitleDescriptionAction>{ type: 'REFRESH_TITLE_DESCRIPTION' }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<TitleDescriptionState> = (state: TitleDescriptionState, action: KnownAction) => {
          // The following line guarantees that every action in the KnownAction union has been covered by a case above
          // const exhaustiveCheck: never = action;

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { itemId: 0 };
};
