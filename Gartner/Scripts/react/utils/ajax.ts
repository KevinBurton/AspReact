export function post<T>(url: string, json?: string): JQueryPromise<T> {
    const settings = <JQueryAjaxSettings>{
        url: url,
        type: 'POST',
        contentType: 'application/json',
        cache: false
    };

    if (json) {
        settings.data = json;
    }

    return sendAjaxRequest(settings);
}

export function postWithSettings<T>(settings: JQueryAjaxSettings): JQueryPromise<T> {

    return sendAjaxRequest(settings);
}

function sendAjaxRequest(settings: JQueryAjaxSettings) {
    return $.ajax(settings)
        .then((response) => {
            return $.Deferred((deferred) => {
                if (response && response.exceptionMessage) {
                    return deferred.reject(response);
                }

                return deferred.resolve(response);
            }).promise();
        });
}

export function get<T>(url: string): JQueryPromise<T> {
    return $.ajax({
        url: url,
        cache: false
    });
}

// Can't use 'delete' here -- reserved JavaScript keyword.
export function doDelete<T>(url: string): JQueryPromise<T> {
    return $.ajax({
        url: url,
        type: 'DELETE',
        cache: false
    });
}
