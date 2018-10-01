import * as React from 'react';

import FileBlock from './FileBlock';
import { SessionFileProps } from './SessionFile';

export interface PeerReviewFilesProps {
	presentationFiles: SessionFileProps[];
	supportingFiles: SessionFileProps[];
};

const PeerReviewFiles = (props: PeerReviewFilesProps) => {
	return (
		<div id="files" className="portlet">
			<div className="portlet-title">
				<div className="caption">Files</div>
				<div className="actions"></div>
			</div>
			<div className="portlet-body">
				<FileBlock
					title={'For Presentation'}
					files={props.presentationFiles}
					noFilesCaption={'No presentation file available'}
				/>
				<FileBlock
					title={'Supporting Files'}
					files={props.supportingFiles}
					noFilesCaption={'No supporting files available'}
				/>
			</div>
		</div>
	);
};

export default PeerReviewFiles;
