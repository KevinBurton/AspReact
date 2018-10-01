module Gartner.AdministrationService {

    function saveAgenda(agendaViewModel: AgendaDetailsViewModel, verb: string): JQueryPromise<string> {
        return $.ajax({
            url: '/api/Agenda',
            type: verb,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(agendaViewModel),
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }

    export function updateAgenda(agendaViewModel: AgendaDetailsViewModel): JQueryPromise<string> {
        return saveAgenda(agendaViewModel, 'PUT');
    }

    export function createAgenda(agendaViewModel: AgendaDetailsViewModel): JQueryPromise<string> {
        return saveAgenda(agendaViewModel, 'POST');
    }

    export function updateEmailNotification(emailNotificationViewModel: EmailNotificationDetailsViewModel): JQueryPromise<string> {
        return $.ajax({
            url: '/api/Notification',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(emailNotificationViewModel),
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }

    export function createEmailNotification(emailNotificationViewModel: EmailNotificationDetailsViewModel): JQueryPromise<string> {
        return $.ajax({
            url: '/api/Notification',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(emailNotificationViewModel),
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }

    export function getExcludedContentTypesForAgenda(agendaId: number): JQueryPromise<string> {
        return $.ajax({
            url: `/api/contenttype/excluded?agendaId=${agendaId}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }

    export function updateSeriesEvent(seriesEventViewModel: SeriesEventsDetailsViewModel): JQueryPromise<string> {
        return saveSeriesEvent(seriesEventViewModel, 'PUT');
    }

    export function createSeriesEvent(seriesEventViewModel: SeriesEventsDetailsViewModel): JQueryPromise<string> {
        return saveSeriesEvent(seriesEventViewModel, 'POST');
    }

    export function addEvent(eventId: number, seriesId: number): JQueryPromise<any> {
        ErrorUtilities.clearErrors();
        //var previewUrl = `/SeriesEvents/AddAssignedEvent/?eventId=${eventId}&seriesId=${seriesId}`;
        //$('#previewForm').attr('action', previewUrl);
        //$('#previewForm').submit();

        return $.ajax({
            url: `/SeriesEvents/AddAssignedEvent/?eventId=${eventId}&seriesId=${seriesId}`,
            type: "POST",
            contentType: "application/json",
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }

    function saveSeriesEvent(seriesEventViewModel: SeriesEventsDetailsViewModel, verb: string): JQueryPromise<string> {
        return $.ajax({
            url: '/api/SeriesEvents',
            type: verb,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(seriesEventViewModel),
            cache: false,
            error: () => ErrorUtilities.showGeneralError()
        });
    }
} 