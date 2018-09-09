import * as React from 'react';
import { connect } from 'react-redux';
import TitleDescription from './TitleDescription';
import DownloadTemplateButton from './DownloadTemplateButton';
import ViewParentAssociationItemWorkFlowStage from './ViewParentAssociationItemWorkFlowStage';
import HlcSessionFileDetails  from './HLCSessionFileDetails';
import HlcItemStatusDates from './HlcItemStatusDates';
import HLCBasicInfo from './HLCBasicInfo';
import OwnerBench from './OwnerBench';
import ReviewerBench from './ReviewerBench';
import SpeakerBench from './SpeakerBench';
import SupportTeam from './SupportTeam';
import ResearchAgenda from './ResearchAgenda';
import Discussion from './Discussion';
import QVRBench from './QVRBench';

export interface HlcItemDetailProps {
  itemId : 0
}

export const HlcItemDetailsComponent = React.createClass<HlcItemDetailProps, any>({

    render() {
        let urlStr = window.location.href;
        let itemId = urlStr.substring(urlStr.lastIndexOf('/') + 1);
        const fileSrc = "http://sharedv.gartner.com/alfcppui/page/ap/ws/cppui/" + itemId;
        const urlChangeLog = window.location.origin + "/HighLeverageContent/History/" + itemId;
        const urlParentAssociation = window.location.origin + "/HighLeverageContent/ViewParentAssociation/" + itemId;

        return (
            <div>
                <div  className="row">
                    <div  className="col-xs-12 col-sm-12 col-md-8">
                        <TitleDescription />

                        <div className="form-group">
                            <span className="icon-documents"></span>{itemId}
                            <span><strong>  |  </strong></span>
                            <a href={urlChangeLog} target="_blank">See Change Log</a>
                            <span><strong>  |  </strong></span>
                            <a role="button" className="btn-link dropdown-toggle" data-toggle="dropdown">Parent Association<span className="caret"></span> </a>
                            <ul className="dropdown-menu">
                                <li><a href={urlParentAssociation} target="_blank">View Parent Association Tree</a></li>
                            </ul>

                        </div>
                    </div>

                    <div id="downloadTemplate" className="col-xs-12 col-sm-12 col-md-4">
                        <div className="right-rail pull-right">
                            <DownloadTemplateButton />
                            <ViewParentAssociationItemWorkFlowStage />
                        </div>
                    </div>
                </div>

                <div className="tabs-wrapper">
                    <ul className="nav nav-tabs primary" role="tablist" id="subItemDetailsContainer">
                        <li role="presentation" className="active">
                            <a id="itemDetailsTab" href="#hlcItemDetails" aria-controls="hlcItemDetails" data-toggle="tab">
                                Content Details
                            </a>
                        </li>
                        <li role="peerReview" >
                            <a id="peerReviewTab" href="#peerReviewTabDetails" data-toggle="tab">
                                Peer Review
                            </a>
                        </li>
                        <HlcSessionFileDetails sfdType='List' />
                    </ul>
                    <div className="tab-content" id="item-details-main">
                        <div id="hlcItemDetails" className="tab-pane active" role="tabpanel">
                            <div  className="row">

                                <div  className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
                                    <HLCBasicInfo/>
                                </div>
                                <div  className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
                                    <HlcItemStatusDates />
                                    <div className="portlet">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                Collaborators
                                            </div>
                                        </div>
                                        <div className="portlet-body">
                                            <OwnerBench />
                                            <ReviewerBench />
                                            <SpeakerBench />
                                            <SupportTeam />
                                        </div>
                                    </div>
                                    <ResearchAgenda />
                                </div>
                            </div>
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="peerReviewTabDetails">
                            <div  className="row">
                                <div  className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
                                    <Discussion />
                                </div>
                                <div  className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
                                    <div className="portlet">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                Reviewers
                                            </div>
                                        </div>
                                        <div className="portlet-body">
                                            <QVRBench />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <HlcSessionFileDetails sfdType='Content' />
                    </div>
                </div>

            </div>
        );
    }
});

export default HlcItemDetailsComponent;
