import * as React from 'react';

import SessionFile, { SessionFileProps } from './SessionFile';

export interface FileBlockProps {
	files: SessionFileProps[];
	noFilesCaption: string;
	title: string;
};

const FileBlock = (props: FileBlockProps) => {
	const displayFiles = props.files && props.files.length > 0;
	return (
		<div className="file-block">
			<h4>{props.title}</h4>
			{!displayFiles && <div className="attached-file"><p>{props.noFilesCaption}</p></div>}
			{displayFiles && props.files.map((file, index) => {
				return (
					<SessionFile
						key={index}
						downloadURL = {file.downloadURL}
						modifiedOn = {file.modifiedOn}
						name={file.name}
						versionLabel = {file.versionLabel}
					/>
				);
			})}
		</div>
	);
};

export default FileBlock;
