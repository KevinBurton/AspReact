import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/generic';
import { TitleDescriptionContainer } from './TitleDescription';
import {DownloadTemplateButtonContainer} from './DownloadTemplateButton';

export interface HlcHeaderProps {
   
}

export const HlcHeaderComponent = React.createClass<HlcHeaderProps, any>({
     
    render() {
        let urlStr = window.location.href;
        let itemId = urlStr.substring(urlStr.lastIndexOf('/') + 1);

        return (
            <div  className="row">
                <div  className="col-xs-12 col-sm-12 col-md-8">
                    <TitleDescriptionContainer />

                    <div className="form-group">
                        <span className="icon-documents"></span>  {itemId}
                       
                    </div>
                </div>

                <div id="downloadTemplate" className="col-xs-12 col-sm-12 col-md-4">
                    <div className="right-rail pull-right">
                        <DownloadTemplateButtonContainer/>
                    </div>
                </div>
            </div>
        );
    }
});
  

export default HlcHeaderComponent;


