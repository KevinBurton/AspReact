module Gartner {

    export interface ITempalteModelTag {
        id: number;
        tags: string[][];
    }

    export class EmailNotificationDetails {

        private notificationWrapperSelector: string;
        private saveButtonSelector: string;
        private previewButtonSelector: string;
        private tags: ITempalteModelTag[];
        private editorId: string;
        private itemComboBox: ItemComboBox;

        private dom = {
            notificationWrapper: null
        };

        onReady = (params: {
            notificationWrapperSelector: string;
            saveButtonSelector: string;
            previewButtonSelector: string;
            tags: ITempalteModelTag[];
            editorId: string;
        }) => {
            this.notificationWrapperSelector = params.notificationWrapperSelector;
            this.saveButtonSelector = params.saveButtonSelector;
            this.previewButtonSelector = params.previewButtonSelector;
            this.tags = params.tags;
            this.editorId = params.editorId;
            this.itemComboBox = Gartner.instanceOf('ItemComboBox');
            this.itemComboBox.selectButtonClickedCallback = this.loadPreview;
            this.init();
        }

        init = () => {
            this.bindDom();
            this.bindEvents();
            this.addTags();
        }

        bindDom = () => {
            this.dom.notificationWrapper = $(this.notificationWrapperSelector);
        }

        bindEvents = () => {
            this.dom.notificationWrapper.on('click', this.saveButtonSelector, () => {
                this.save();
            });
            this.dom.notificationWrapper.on('click', this.previewButtonSelector, (e) => {
                e.preventDefault();
                this.openPreviewModal();
            });
            this.dom.notificationWrapper.on('change', '#TemplateModelTypeId', () => {
                this.addTags();
            });
        }

        openPreviewModal = () => {
            var loaderContainer = $('.modal-body-loader');
            var contentContainer = $('.modal-body-content');
            contentContainer.html('');

            this.itemComboBox.clear();
            if (!this.validatePreview()) {
                return;
            }

            var previewModal = this.dom.notificationWrapper.find('#previewModal');
            contentContainer.hide();
            loaderContainer.hide();
            previewModal.modal('show');
        };

        loadPreview = (templateModelId: number) => {
            var loaderContainer = $('.modal-body-loader');
            var contentContainer = $('.modal-body-content');
            contentContainer.html(`<iframe id="previewIframe" name="previewIframe" width="100%" height="500px"></iframe>`);
            var iframe = $(`#previewIframe`);

            iframe.attr('src', '');
            loaderContainer.show();
            contentContainer.hide();
            iframe.load(() => {
                contentContainer.show();
                loaderContainer.hide();
            });
            const templateModelTypeId = Number(this.dom.notificationWrapper.find('#TemplateModelTypeId').val());
            var previewUrl = `/Administration/PreviewNotification/?templateModelId=${templateModelId}&templateModelTypeId=${templateModelTypeId}`;
            $('#previewForm').attr('action', previewUrl);
            $('#previewForm').submit();
        };

        addTags = () => {
            const templateModelTypeId = Number(this.dom.notificationWrapper.find('#TemplateModelTypeId').val());

            const tags = this.tags.filter(tag => tag.id === templateModelTypeId);

            if (tags.length > 0) {
                CKEDITOR.config.strinsert_strings = tags.pop().tags;
                CKEDITOR.config.toolbar = 'Admin';
            } else {
                CKEDITOR.config.toolbar = 'Default';
            }

            if (CKEDITOR.instances[this.editorId]) {
                const tmp = CKEDITOR.instances[this.editorId].getData();

                CKEDITOR.instances[this.editorId].destroy(true);

                CKEDITOR.replaceAll();

                $(`#${this.editorId}`).val(tmp);
            }
        }

        save = () => {
            var self = this;
            var notification = new EmailNotificationDetailsViewModel({
                Base: new NotificationDetailsViewModel({
                    Id: this.dom.notificationWrapper.find('#Id').val(),
                    Name: this.dom.notificationWrapper.find('#Name').val(),
                    TemplateModelTypeId: this.dom.notificationWrapper.find('#TemplateModelTypeId').val(),
                    StartTimestamp: this.dom.notificationWrapper.find('#StartTimestamp').val(),
                    EndTimestamp: this.dom.notificationWrapper.find('#EndTimestamp').val(),
                    Trigger: new NotificationTriggerViewModel({
                        ActivityId: this.dom.notificationWrapper.find('#Trigger_ActivityId').val(),
                        WorkflowId: this.dom.notificationWrapper.find('#Trigger_WorkflowId').val(),
                        WorkflowStageId: this.dom.notificationWrapper.find('#Trigger_WorkflowStageId').val()
                    })
                }),
                From: this.dom.notificationWrapper.find('#From').val(),
                To: this.dom.notificationWrapper.find('#To').val(),
                Cc: this.dom.notificationWrapper.find('#Cc').val(),
                Subject: this.dom.notificationWrapper.find('#Subject').val(),
                Body: CKEDITOR.instances[this.editorId].getData()
            });
            if (this.validate(notification)) {
                if (notification.Id == 0) {
                    AdministrationService.createEmailNotification(notification)
                        .done(response => {
                            self.updateView(response);
                            toastr.success('Created Notification.');
                        });
                } else {
                    AdministrationService.updateEmailNotification(notification)
                        .done(response => {
                            self.updateView(response);
                            toastr.success('Updated Notification.');
                        });
                }
            }
        }

        validate = (notification: EmailNotificationDetailsViewModel) => {
            var messages = new Array();
            // Name is required by default
            if (notification.Name.length === 0) {
                messages.push('Template Name is required.');
            }
            // End Timestamp cannot preceed Start Timestamp
            var startTimestampDatetime = Date.parse(notification.StartTimestamp);
            var endTimestampDatetime = Date.parse(notification.EndTimestamp);
            if (notification.EndTimestamp.length !== 0 && (endTimestampDatetime < startTimestampDatetime)) {
                messages.push('End Timestamp cannot preceed Start Timestamp.');
            }
            // Start Timestamp and End Timestamp cannot be the same
            if (startTimestampDatetime == endTimestampDatetime) {
                messages.push('Start Timestamp and End Timestamp cannot be the same.');
            }
            // Start Timestamp cannot be null if End Timestamp is set
            if (notification.EndTimestamp.length !== 0 && notification.StartTimestamp.length === 0) {
                messages.push('Start Timestamp cannot be empty if End Timestamp is set.');
            }
            // Some fields are required when Start Timestamp is set
            if (notification.StartTimestamp.length !== 0) {
                if (notification.TemplateModelTypeId < 0) {
                    messages.push('Template Model Type cannot be empty if Start Timestamp is set.');
                }
                if (notification.To.length === 0) {
                    messages.push('To cannot be empty if Start Timestamp is set.');
                }
                if (notification.From.length === 0) {
                    messages.push('From cannot be empty if Start Timestamp is set.');
                }
                if (notification.Subject.length === 0) {
                    messages.push('Subject cannot be empty if Start Timestamp is set.');
                }
                if (notification.Body.length === 0) {
                    messages.push('Body cannot be empty if Start Timestamp is set.');
                }
                if (notification.Trigger.ActivityId < 0) {
                    messages.push('Trigger Activity cannot be empty if Start Timestamp is set.');
                }
            }
            if (messages.length > 0) {
                toastr.error(messages.join('<br />'));
                return false;
            }
            return true;
        }

        updateView = (notificationId) => {
            this.dom.notificationWrapper.find('#Id').val(notificationId);
        }

        validatePreview = () => {
            var messages = new Array();
            var templateModelTypeId = this.dom.notificationWrapper.find('#TemplateModelTypeId').val();
            var from = this.dom.notificationWrapper.find('#From').val();
            var to = this.dom.notificationWrapper.find('#To').val();
            var subject = this.dom.notificationWrapper.find('#Subject').val();
            var body = CKEDITOR.instances[this.editorId].getData();//this.dom.notificationWrapper.find('#Body').val();
            // Template Model Type is required for preview
            if (templateModelTypeId < 0) {
                messages.push('Template Model Type is required for Preview.');
            }
            // From is required for preview
            if (from.length === 0) {
                messages.push('From is required for Preview.');
            }
            // To is required for preview
            if (to.length === 0) {
                messages.push('To is required for Preview.');
            }
            // Subject is required for preview
            if (subject.length === 0) {
                messages.push('Subject is required for Preview.');
            }
            // Body is required for preview
            if (body.length === 0) {
                messages.push('Body is required for Preview.');
            }
            if (messages.length > 0) {
                toastr.error(messages.join('<br />'));
                return false;
            }
            return true;
        }
    }
}