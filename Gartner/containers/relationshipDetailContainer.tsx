import * as React from 'react';
import { connect } from 'react-redux';
import RelationshipDetail from '../components/RelationshipDetail'; 

const mapStateToProps = (state) => {
    return {
        relationshipType: state.itemShared.relationshipType,
        parentItemId : state.itemShared.parentItemId
    };
};

const RelationshipDetailContainer =
    connect(
        mapStateToProps
    )(RelationshipDetail) as () => JSX.Element;

export default RelationshipDetailContainer;


