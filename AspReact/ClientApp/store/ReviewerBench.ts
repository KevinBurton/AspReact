import { Reducer } from 'redux';
import { ComponentDescriptor } from '../models/componentDescriptor'
import * as ajax from '../utils/ajax';
import objectAssign from '../utils/objectAssign';

// -----------------
// TYPE


// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface Reviewer {
    ID: { 
            Value: string 
        },
    ReviewedByEmployeeId: { 
        Value: string 
    },
    ReviewStatus: {
        Value: string
    },
    EmployeeId: {
        Value: string,
        IsEnabled: boolean
    },
    FullName: {
        Value: string
    },
    VendorName: {
        Value: string
    },
    DelegateNames: {
        Value: string
    },
    DelegateEmails: {
        Value: string
    },
    Description: {
        Value: string
    },
    ItemReviewerTypeId: { 
        Value: string
    }
    ActionButton: {
        Value: string
    }
}
export interface ReviewerBenchState {
    itemId: number;
    reviewerBench: Reviewer[];
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
interface RefreshReviewerBenchAction { type: 'REFRESH_REVIEWER_BENCH_COMPONENT' }
interface ReceiveComponentDataAction { type: 'RECEIVE_COMPONENT_DATA' }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RefreshReviewerBenchAction & ReceiveComponentDataAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    refresh: () => <RefreshReviewerBenchAction>{ type: 'REFRESH_REVIEWER_BENCH_COMPONENT' },
    receiveComponentData: (newObject: any, componentDescriptor: ComponentDescriptor) => <ReceiveComponentDataAction>{ type: 'RECEIVE_COMPONENT_DATA' },
    componentData: (componentDescriptor: ComponentDescriptor, operation: string, onComplete?: (o:any) => {}) => {
        return (dispatch: Function, getState: Function) => {
            const state = getState();
            const { itemId } = state;
            if (operation === '') { operation = 'GetData' }
    
            var dictionary = componentDescriptor.dataDictionary;
            var s = ''; // 'ID=' + itemId + ',';
    
            for (var i in dictionary) {
                if (dictionary.hasOwnProperty(i)) {
                    s = s + i + '=' + dictionary[i] + ',';
                }
            }
    
            s = s.substr(0, s.length - 1);
            ajax.get<any>(`/api/GenericDataHandler/ComponentData/?componentName=${componentDescriptor.name}&operation=${operation}&passedInData=${s}`)
                .then((newObject) => {
                    var combinedObject: Object = newObject.ObjectToReturn;
                    if (newObject.FailureList) {
                        if (!(Object.keys(newObject.FailureList).length === 0 && newObject.constructor === Object)) {
                            for (var j = 0; j < newObject.FailureList.length; j++) {
                                toastr.error(newObject.FailureList[j].Text);
                            }
                        }
                    }
                    if (newObject.DataList) {
                        if (!(Object.keys(newObject.DataList).length === 0 && newObject.constructor === Object)) {
                            combinedObject = objectAssign({}, newObject.ObjectToReturn[0], {
                                DataList: newObject.DataList
                            })
                        };
    
                    }
    
                    if (!(Object.keys(newObject).length === 0 && newObject.constructor === Object)) {
                        dispatch(receiveComponentData(combinedObject, componentDescriptor));
                        if (onComplete) {
                            if (newObject.SuccessList.length > 0) {
                                const addedObject = newObject
                                    .ObjectToReturn
                                    .find((o:any) => o.ID.Value === newObject.SuccessList[0].Id.toString())
                                onComplete(addedObject);
                            } else {
                                onComplete(newObject);
                            }
                        }
                    }
    
                })
                .fail(() => {
                    console.error("could not retrieve data for item id ");
                });
        };
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<ReviewerBenchState> = (state: ReviewerBenchState, action: KnownAction) => {
          // The following line guarantees that every action in the KnownAction union has been covered by a case above
          // const exhaustiveCheck: never = action;

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { itemId: 0 };
};
