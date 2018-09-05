import * as React from 'react';

export interface SessionFileProps {
	downloadURL: string;
	modifiedOn: string;
	name: string;
	versionLabel: string;
};

const SessionFile = (props: SessionFileProps) => {
	return (
		<div className="attached-file">
			<a href="" className="file bg-info pull-left push-10-r">
				<i className="si si-rocket text-white-op"></i>
			</a>
			<ul className="list-unstyled">
				<li>
					<h5 className="push-10-t">
						<a href={props.downloadURL}>{props.name}&nbsp;<label className="label label-default">{props.versionLabel}</label></a>
					</h5>
				</li>
				<li><p className="mod-date">Last Updated {props.modifiedOn}</p></li>
			</ul>
		</div>
	);
};

export default SessionFile;
