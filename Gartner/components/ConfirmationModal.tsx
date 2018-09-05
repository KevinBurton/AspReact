import * as React from 'react';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import objectAssign from './../utils/objectAssign';
import { Event } from '../models/event';

export interface ConfirmationModalProps {
    ConfirmationHeader?: string;
    ConfirmationText?: string;
    ShowCancelButton?: boolean;
    CancelButtonText?: string;
};

const ConfirmationModal = ({ConfirmationText = "",
                            ConfirmationHeader="Confirm",
                            ShowCancelButton = false,
                            CancelButtonText = "Cancel"}: ConfirmationModalProps) => {
    return (
        <div>
            <a href="#" id="showModal" data-toggle="modal" hidden={true} data-target="#confirmPopUp">warning dialog</a>
            <div className="modal fade" id="confirmPopUp" tabIndex={-1} role="dialog" aria-hidden="false">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{ConfirmationHeader}</h4>
                        </div>

                        <div className="modal-body">
                            <div className="modal-content-block">
                                <p>
                                    {ConfirmationText}
                                </p>
                            </div>
                            <div className="modal-footer"  >
                                <CancelButton buttonText={CancelButtonText} />
                            </div>
                        </div>

                    </div>
                </div>
              
            </div>
            </div>
        );
};

export default ConfirmationModal ;
