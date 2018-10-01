import * as React from 'react';
import { connect } from 'react-redux';
import ParentItemTitle from '../components/ParentItemTitle';


const mapStateToProps = (state) => {
    return {
        parentItemTitle: state.itemShared.title
    };
};

const ParentItemTitleContainer =
    connect(
        mapStateToProps
    );

export default ParentItemTitleContainer;


