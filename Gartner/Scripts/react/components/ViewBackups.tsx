import * as React from 'react';
import { Backup } from '../models/backupReviewer';

export interface ViewBackupsProps {
	itemId: number;
	currentReviewerName: string;
	backups: Backup[];
}

const ViewBackups = ({itemId, currentReviewerName, backups}: ViewBackupsProps) => {
	const getLink = (email: string, itemId: number) => {
		return `mailto:${email}?subject=Backup Request for CPP ${itemId}&body= ${encodeURIComponent(window.location.href)}`;
	};

	return (
		<div className="modal-dialog modal-lg" role="document">
			<div className="modal-content">
				<div className="modal-header">
					<h4 className="modal-title">Backup Reviewers for {currentReviewerName}</h4>
				</div>
				<div className="modal-body">
					<table className="table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{backups.map((backup, i) => (
								<tr key={backup.name + i}>
									<td>{backup.name}</td>
									<td><a href={getLink(backup.emailAddress, itemId)}>Email</a></td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="modal-footer">
						<button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewBackups;