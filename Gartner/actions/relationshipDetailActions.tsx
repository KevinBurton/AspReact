declare var $;

export const SET_RELATIONSHIP_DETAIL = 'SET_RELATIONSHIP_DETAIL';

export const getRelationshipDetail = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;

        $.ajax({
            url: `/api/ItemKeywords/${itemId}`,
            cache: false
        })
            .then((keywords) => {
                dispatch(setRelationshipDetail(keywords));
            });
    };
};

export const setRelationshipDetail = (relationshipDetail) => {
    return {
        type: SET_RELATIONSHIP_DETAIL,
        relationshipDetail
    };
};
