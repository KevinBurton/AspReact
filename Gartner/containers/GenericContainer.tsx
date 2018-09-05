import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/genericActions';
import { GenericComponent } from '../components/GenericComponent';



const mapStateToProps = (state) => {
	return {
        itemId: state.itemId,
        myCollection: state.myCollection
	};
};

const GenericContainer =
    connect(
        mapStateToProps,
        actions
    )(GenericComponent) as React.ClassicComponentClass<any>;



export default GenericContainer;
