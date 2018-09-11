import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect } from 'react-redux';

import { ComponentDescriptor } from '../models/generic';
import { ContentFocusContainer } from './ContentFocusField';
import { ContentMaturityContainer } from './ContentMaturityField';
import { LanguageContainer } from './LanguageField';
import { ResearchElementTypeFieldContainer } from './ResearchElementTypeField';
import { IndustryFieldContainer } from './IndustryField';
import { SessionAlignsToContainer } from './SessionAlignsToField';
import { CommentsFieldContainer } from './CommentsField';
import { CopyrightPermissionsFieldContainer } from './CopyrightPermissionsField';
import { SessionCategoryContainer } from './SessionCategory';
import { NeedsExternalReviewFieldContainer } from './NeedsExternalReviewField';
import { TotalPagesFieldContainer } from './TotalPagesField';
import { ContentAspectContainer } from './ContentAspectField';
import { SeriesDefinitionContainer } from './SeriesDefinition';
import { VendorBenchContainer } from './VendorBench';

export interface HLCBasicInfoProps {
    HLCBasicInfo?: Object;
}

export const HLCBasicInfoComponent = React.createClass<HLCBasicInfoProps, any>({

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
});

const mapStateToProps = (state: any) => {
    if (!state.HLCBasicInfo) {
        const { itemId } = state;
        return {
            itemId: state.itemId

        };
    }

    return {
        itemId: state.itemId
    };
};

export const HLCBasicInfoContainer =
    connect(
        mapStateToProps,
        actions
    )(HLCBasicInfoComponent as React.ClassicComponentClass<any>);

export default HLCBasicInfoComponent;


