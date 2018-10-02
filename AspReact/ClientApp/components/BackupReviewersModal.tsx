import * as React from 'react';
import CancelButton from './CancelButton';

export interface BackupReviewersModalProps {
    Reviewer: any;
	ItemId: number;
};


class BackupReviewersModal extends React.Component<BackupReviewersModalProps, any> {
    public static defaultProps: BackupReviewersModalProps = {
        Reviewer: {
            FullName: {
                Value: ''
            }
        },
        ItemId: 0
    } as BackupReviewersModalProps;
    constructor(props: BackupReviewersModalProps) {
        super(props);
        // Binding
        this.getLink = this.getLink.bind(this);
        this.getNames = this.getNames.bind(this);
        this.getEmails = this.getEmails.bind(this);
        this.getDelegates = this.getDelegates.bind(this);
    }
    getLink(email: string, itemId: number): string
    {
        return `mailto:${email}?subject=Backup Request for CPP ${itemId}&body= ${encodeURIComponent(window.location.href)}`;
    }
    getNames(DelegateNames: string): string[] {
        return DelegateNames.split(';');
    }
    getEmails(DelegateEmails: string): string[] {
        return DelegateEmails.split(';');
    }
    getDelegates(Reviewer: any): any[] {
        if (!Reviewer) {
            return [{ Email: '', Name: '' }];
        }
        let names = this.getNames(Reviewer.DelegateNames.Value);
        let emails = this.getEmails(Reviewer.DelegateEmails.Value);
        let delString = [];

        for (var i = 0; i < names.length; i++) {
            if (names[i] != '') {
                delString.push({ Email: emails[i], Name: names[i] });
            }
        }
        return delString;
    }
    render() {
        return (
            <div>
                <div className="modal fade" id="reviewerBackupPopup" tabIndex={-1} role="dialog" aria-hidden="false">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{`Backup(s) for ${(this.props.Reviewer && this.props.Reviewer.FullName) ? this.props.Reviewer.FullName.Value : ''}`}</h4>
                            </div>
                            <div className="modal-body">
                                <div className="modal-content-block">
                                    <div className="modal-content-block">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.getDelegates(this.props.Reviewer).map((delString, i) => (
                                                    <tr key={i}>
                                                        <td key={delString.Name + i.toString() + 'Name'}>{delString.Name}</td>
                                                        <td key={delString.Email + i.toString() + 'Email'}>
                                                            {delString.Email != '' ?
                                                                <a key={delString.Email + i.toString() + 'Link'} href={this.getLink(delString.Email, this.props.ItemId)}>Email</a>
                                                                : <div></div>}
                                                        </td>
                                                    </tr>))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="modal-footer"  >
                                        <CancelButton buttonText={'Close'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BackupReviewersModal ;
