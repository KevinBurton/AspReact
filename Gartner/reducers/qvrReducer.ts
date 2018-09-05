import objectAssign from '../utils/objectAssign';
import { Reviewer, Modal, Qvr, Reason } from '../models/qvr';

import {
	RECEIVE_QVR,
	RECEIVE_REASONS,
	QVR_SAVED,
	STARTED_REFRESH,
	ITEM_REVIEWERS_CHANGED,
	ITEM_VENDORS_CHANGED,
	OPEN_MODAL,
	CLOSE_MODAL,
	MODAL_RATE_REVIEWER,
	MODAL_COMMENT_CHANGED,
	MODAL_QVR_SAVED,
	MODAL_IS_SAVING,
	MODAL_DID_NOT_PROVIDE_PEER_REVIEW,
	MODAL_REASON_CHANGED,
	MODAL_APPLY_CHANGES
} from '../actions/qvrActions';

interface State {
	reviewers: Array<Reviewer>;
	modal: Modal;
	shouldRefresh: boolean;
}

const initialState: State = {
	reviewers: [],
	modal: {
		isOpen: false,
		isSaving: false,
		currentReviewer: undefined,
		reasons: [],
		rating: undefined,
		comment: undefined,
		hasNoPeerReviewProvided: false,
		reasonId: undefined
	},
	shouldRefresh: false
};

const changeModalState = (state: State, modal: Modal): State => objectAssign({}, state, { modal });

const changeCurrentReviewerState = (state: State, currentReviewer?: Reviewer) => {
	const nextModal = objectAssign({}, state.modal, { currentReviewer });

	return changeModalState(state, nextModal);
};

const changeCurrentReviewerQvrState = (state: State, qvr?: Qvr): State => {
	const nextReviewer = objectAssign({}, state.modal.currentReviewer, { qvr });

	return changeCurrentReviewerState(state, nextReviewer);
};

const qvrSaved = (state: State, reviewerId: number, qvr: Qvr) => {
	return objectAssign({}, state, {
		reviewers: state.reviewers.map(reviewer => {
			if (reviewer.id === reviewerId) {
				return objectAssign({}, reviewer, {
					qvr
				});
			}

			return reviewer;
		})
	});
};

const receiveReasons = (state: State, reasons: Reason[]) => {
	return changeModalState(state, objectAssign({}, state.modal, { reasons }));
};

const shouldRefresh = (state: State, should: boolean) => objectAssign({}, state, { shouldRefresh: should });

const toggleModalIsOpen = (state: State, isOpen: boolean) =>
	changeModalState(state, objectAssign({}, state.modal, { isOpen }));

const setCurrentReviewer = (state: State, reviewer?: Reviewer) => {
	let rating, comment, hasNoPeerReviewProvided, reasonId;

	if(reviewer) {
		rating = reviewer.qvr ? reviewer.qvr.rating : undefined;
		comment = reviewer.qvr ? reviewer.qvr.comment : '';
		hasNoPeerReviewProvided = reviewer.qvr && !reviewer.qvr.rating;
		reasonId = reviewer.qvr ? reviewer.qvr.reasonId : undefined;
	} else {
		rating = undefined;
		comment = undefined;
		hasNoPeerReviewProvided = false;
		reasonId = undefined;
	}

	return changeModalState(state, objectAssign({}, state.modal, {
		currentReviewer: reviewer,
		rating,
		comment,
		hasNoPeerReviewProvided,
		reasonId
	}));
};

const modalRateReviewer = (state: State, rating?: number) => {
	if (state.modal.currentReviewer) {
		return changeModalState(state, objectAssign({}, state.modal, {
			rating
		}));
	}

	return state;
};

const modalCommentChanged = (state: State, comment: string) => {
	if (state.modal.currentReviewer) {
		return changeModalState(state, objectAssign({}, state.modal, {
			comment
		}));
	}

	return state;
};

const modalReasonChanged = (state: State, reasonId?: number) => {
	if (state.modal.currentReviewer) {
		return changeModalState(state, objectAssign({}, state.modal, {
			reasonId
		}));
	}

	return state;
};

const modalDidNotProvidePeerReview = (state: State, didNotProvide: boolean) => {
	const { currentReviewer } = state.modal;

	if (currentReviewer) {
		return changeModalState(state, objectAssign({}, state.modal, {
			hasNoPeerReviewProvided: didNotProvide,
			rating: undefined,
			reasonId: undefined
		}));
	}

	return state;
};

const modalIsSaving = (state: State, isSaving: boolean) =>
	changeModalState(state, objectAssign({}, state.modal, { isSaving }));

const modalQvrSaved = (state: State) => {
	const { currentReviewer } = state.modal;

	if (currentReviewer) {
		const nextState = objectAssign({}, state, {
			reviewers: state.reviewers.map(reviewer => {
				if (reviewer.id === currentReviewer.id) {
					return currentReviewer;
				}

				return reviewer;
			})
		}) as State;

		return changeCurrentReviewerState(nextState, undefined);
	}

	return state;
};

const modalApplyChanges = (state: State) => {
	return changeCurrentReviewerQvrState(state, objectAssign({}, state.modal.currentReviewer.qvr, {
		rating: state.modal.rating,
		reasonId: state.modal.reasonId,
		comment: state.modal.comment
	}));
};

const qvr = (state: State = initialState, action) => {
	switch (action.type) {
		case RECEIVE_QVR:
			const { itemReviewers, showQvr } = action.reviewersCollection;

			return objectAssign({}, state, {
				reviewers: itemReviewers,
				showQvr
			});

		case RECEIVE_REASONS:
			return receiveReasons(state, action.reasons);

		case ITEM_REVIEWERS_CHANGED:
			return shouldRefresh(state, true);

		case ITEM_VENDORS_CHANGED:
			return shouldRefresh(state, true);

		case STARTED_REFRESH:
			return shouldRefresh(state, false);

		case OPEN_MODAL:
			if (action.rating) {
				return modalRateReviewer(setCurrentReviewer(toggleModalIsOpen(state, true), action.reviewer), action.rating);
			} else {
				return setCurrentReviewer(toggleModalIsOpen(state, true), action.reviewer);
			}

		case CLOSE_MODAL:
			if (action.clearReviewer) {
				return setCurrentReviewer(toggleModalIsOpen(state, false), undefined);
			} else {
				return toggleModalIsOpen(state, false);
			}

		case MODAL_RATE_REVIEWER:
			return modalRateReviewer(state, action.rating);

		case MODAL_COMMENT_CHANGED:
			return modalCommentChanged(state, action.comment);

		case MODAL_REASON_CHANGED:
			return modalReasonChanged(state, action.reasonId);

		case QVR_SAVED:
			return qvrSaved(state, action.reviewerId, action.qvr);

		case MODAL_IS_SAVING:
			return modalIsSaving(state, action.isSaving);

		case MODAL_QVR_SAVED:
			return modalQvrSaved(state);

		case MODAL_DID_NOT_PROVIDE_PEER_REVIEW:
			return modalDidNotProvidePeerReview(state, action.didNotProvide);

		case MODAL_APPLY_CHANGES:
			return modalApplyChanges(state);
	}
	return state;
};

export default qvr;
