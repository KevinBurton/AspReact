import * as React from 'react';
import { connect } from 'react-redux';

import { ContentFocusContainer } from './ContentFocusField';
import { ContentMaturityContainer } from './ContentMaturityField';
import { LanguageContainer } from './LanguageField';
import { ResearchElementTypeFieldContainer } from './ResearchElementTypeField';
import { IndustryFieldContainer } from './IndustryField';
import { SessionAlignsToContainer } from './SessionAlignsToField';
import { CommentsFieldContainer } from './CommentsField';
import { SessionCategoryContainer } from './SessionCategory';
import { NeedsExternalReviewFieldContainer } from './NeedsExternalReviewField';
import { TotalPagesFieldContainer } from './TotalPagesField';
import { ContentAspectContainer } from './ContentAspectField';
import { SeriesDefinitionContainer } from './SeriesDefinition';
import { VendorBenchContainer } from './VendorBench';
import { ApplicationState }  from '../store';
import * as HlcBasicInfoStore from '../store/HlcBasicInfo';

export interface HlcBasicInfoProps {
    HlcBasicInfo?: Object;
}

class HlcBasicInfo extends React.Component<HlcBasicInfoProps, any> {

    render() {

        return (
            <div className="portlet">
                <div className="portlet-title">
                    <div className="caption">
                        Basic Information
                    </div>
                </div>
                <div className="portlet-body">
                    <SessionCategoryContainer />
                    <SeriesDefinitionContainer />
                    <SessionAlignsToContainer />
                    <IndustryFieldContainer />
                    <LanguageContainer />
                    <ResearchElementTypeFieldContainer />
                    <NeedsExternalReviewFieldContainer />
                    <ContentFocusContainer />
                    <ContentAspectContainer />
                    <ContentMaturityContainer />
                    <CommentsFieldContainer />
                    <TotalPagesFieldContainer />
                    <VendorBenchContainer />
                </div>
            </div>
        );
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.hlcBasicInfo, // Selects which state properties are merged into the component's props
    HlcBasicInfoStore.actionCreators                 // Selects which action creators are merged into the component's props
)(HlcBasicInfo) as typeof HlcBasicInfo;
