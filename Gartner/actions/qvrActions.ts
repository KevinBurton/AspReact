import * as ajax from '../utils/ajax';
import { addError, addSuccess } from './alertActions';
import { Qvr, Reviewer, ReviewersCollection, Reason } from '../models/qvr';


export const RECEIVE_QVR = 'RECEIVE_QVR';
export const RECEIVE_REASONS = 'RECEIVE_QVR_REASONS';
export const QVR_SAVED = 'QVR_SAVED';
export const STARTED_REFRESH = 'QVR_STARTED_REFRESH';
export const ITEM_REVIEWERS_CHANGED = 'ITEM_REVIEWERS_CHANGED';
export const ITEM_VENDORS_CHANGED = 'ITEM_VENDORS_CHANGED';

export const OPEN_MODAL = 'QVR_OPEN_MODAL';
export const CLOSE_MODAL = 'QVR_CLOSE_MODAL';
export const MODAL_RATE_REVIEWER = 'MODAL_RATE_REVIEWER';
export const MODAL_COMMENT_CHANGED = 'MODAL_QVR_COMMENT_CHANGED';
export const MODAL_REASON_CHANGED = 'MODAL_QVR_REASON_CHANGED';
export const MODAL_QVR_SAVED = 'MODAL_QVR_SAVED';
export const MODAL_IS_SAVING = 'MODAL_QVR_IS_SAVING';
export const MODAL_DID_NOT_PROVIDE_PEER_REVIEW = 'MODAL_QVR_DID_NOT_PROVIDE_PEER_REVIEW';
export const MODAL_APPLY_CHANGES = 'MODAL_QVR_APPLY_CHANGES';

export const getQvr = () => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;
		
		ajax.get<ReviewersCollection>(`/api/Qvr/${itemId}`)
			.then((reviewersCollection) => {
				dispatch(receiveQvr(reviewersCollection));
			});
	};
};

export const receiveQvr = (reviewersCollection: ReviewersCollection) => {
	return {
		type: RECEIVE_QVR,
		reviewersCollection
	}
};

export const startedRefresh = () => {
	return {
		type: STARTED_REFRESH
	}
};

export const saveQvr = (reviewerId: number, qvr: Qvr) => {
	return (dispatch, getState) => {
		const state = getState();
		const { reviewers } = state.qvr;
		const reviewer = reviewers.filter(x => x.id === reviewerId)[0];
		var previousQvr = reviewer ? reviewer.qvr : undefined;

		//optimistic update
		dispatch(qvrSaved(reviewerId, qvr));

		ajax.post(`/api/qvr/${reviewerId}`, JSON.stringify(qvr))
			.fail((error) => {
				// revert optimistic update
				dispatch(qvrSaved(reviewerId, previousQvr));
				console.error(error);
				dispatch(addError('QVR', 'Unable to save rating.'));
			});
	};
};

export const qvrSaved = (reviewerId: number, qvr: Qvr) => {
	return {
		type: QVR_SAVED,
		reviewerId,
		qvr
	};
};

export const saveModalQvr = () => {
	return (dispatch, getState) => {
		dispatch(applyModalChangesToCurrentReviewer());

		const state = getState();
		const { currentReviewer } = state.qvr.modal;

		if (currentReviewer) {
			dispatch(modalIsSaving(true));

			ajax.post(`/api/qvr/${currentReviewer.id}`, JSON.stringify(currentReviewer.qvr))
				.done(() => {
					dispatch(modalIsSaving(false));
					dispatch(closeRatingModal(false));
					dispatch(modalSaved());
				})
				.fail(() => {
					dispatch(modalIsSaving(false));
					dispatch(addError('QVR', 'Unable to save rating.'));
				});
		}
	};
};

export const applyModalChangesToCurrentReviewer = () => {
	return {
		type: MODAL_APPLY_CHANGES
	};
};

export const modalIsSaving = (isSaving: boolean) => {
	return {
		type: MODAL_IS_SAVING,
		isSaving
	};
};

export const modalSaved = () => {
	return {
		type: MODAL_QVR_SAVED
	};
};

export const openRatingModal = (reviewer: Reviewer, rating?: number) => {
	return {
		type: OPEN_MODAL,
		reviewer,
		rating
	};
};

export const closeRatingModal = (clearReviewer: boolean = true) => {
	return {
		type: CLOSE_MODAL,
		clearReviewer
	};
};

export const modalRatingSelected = (rating?: number) => {
	return {
		type: MODAL_RATE_REVIEWER,
		rating
	};
};

export const modalCommentChanged = (comment: string) => {
	return {
		type: MODAL_COMMENT_CHANGED,
		comment
	};
};

export const didNotProvidePeerReviewChanged = (didNotProvide: boolean) => {
	return {
		type: MODAL_DID_NOT_PROVIDE_PEER_REVIEW,
		didNotProvide
	};
};

export const reasonChanged = (reasonId?: number) => {
	return {
		type: MODAL_REASON_CHANGED,
		reasonId
	};
};

export const getReasons = () => {
	return (dispatch) => {
		ajax.get<Reason[]>('/api/qvrreason')
			.done((reasons) => dispatch(receiveReasons(reasons)));
	};
};

export const receiveReasons = (reasons: Reason[]) => {
	return {
		type: RECEIVE_REASONS,
		reasons
	}
};

export const saveReviewer = (employeeId: number) => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;
		
		ajax.post(`/api/AddReviewer/SaveReviewer?id=${itemId}&employeeId=${employeeId}`)
			.done(() => {
				dispatch({ type: ITEM_REVIEWERS_CHANGED });
				Gartner.UpdateHelper.updateAjaxPanels(['Reviewers']);
				dispatch(addSuccess('Add Reviewer', 'Added peer reviewer.'));
			})
			.fail(response => {
				if (response && response.exceptionMessage) {
					dispatch(addError('Add Reviewer Fail', response.exceptionMessage));
				} else {
					dispatch(addError('Add Reviewer Fail', 'Unable to save peer reviewer.'));
				}
				
			});
		return STARTED_REFRESH;
	};
};
