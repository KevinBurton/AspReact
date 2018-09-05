import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/generic';
import { HlcItemStatusDatesContainer } from './HlcItemStatusDates';
import {HLCBasicInfoContainer} from './HLCBasicInfo';

export interface HlcHeaderProps {
   
}

export const HlcBodyComponent = React.createClass<HlcHeaderProps, any>({
     
    render() {
        return (
            <div  className="row">

                <div  className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
                   
                        <HLCBasicInfoContainer/>
                 
                </div>
                <div  className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
                 
                        <HlcItemStatusDatesContainer />
                </div>
           </div>
        );
    }
});
  

export default HlcBodyComponent;


