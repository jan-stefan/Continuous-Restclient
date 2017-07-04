var REST = (function () {

    var properties = {
        errorMassage: "Request failed",
        debug: false
    };

    var debugMessages = {
        requestStateSuccessful: "DEBUG: State changed: Request was successful.",
        requestStateRedirected: "DEBUG: State changed: Redirected.",
        requestStateClientError: "DEBUG: State changed: Client error.",
        requestStateServerError: "DEBUG: State changed: Server error.",
        xmlHttpRequestSend: "DEBUG: Request was send.",
        xmlHttpRequestOpened: "DEBUG: Request was opened."
    };

    var message = {
        successful: "SUCCESS: successfully requested.",
        serverError: "ERROR: Server didn\'t respond to your request.",
        clientError: "ERROR: Client was NOT able to perform the request.",
        redirect: "ERROR: Redirected."
    };

    var methods = {
        get: "GET",
        post: "POST",
        put: "PUT",
        delete: "DELETE",
        head: "HEAD",
        options: "OPTIONS"
    };


    function REST() {
    }

    /**
     * Enables debug mode for this object.
     */
    REST.prototype.enableDebugMode = function () {
        properties.debug = true;
    };

    /**
     * Disables the debug mode for this object.
     */
    REST.prototype.disableDebugMode = function () {
        properties.debug = false;
    };

    /**
     * Sends a get request to consume data from a Restful service.
     *
     * @param url {string} Url where the resource should be found.
     * @param synch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @param onServerError {function(responseText,statusCode,statusMessage)} function executes on a error at the server side.
     * @param onClientError {function(responseText,statusCode,statusMessage)} function executes on a error at the client side.
     * @param onRedirect {function(responseText,statusCode,statusMessage)} function executes if your were redirected.
     * @constructor
     */
    REST.prototype.GET = function (url, synch, onSuccess, onServerError, onClientError, onRedirect) {
        request(methods.get, url, synch, onSuccess, null, onRedirect, onClientError, onServerError, null);
    };

    /**
     * Creates new resource on the server. ResponseText provides a link to the newly created resource on the Restful service.
     *
     * @param url {string} Url where the new resource should be created.
     * @param synch {boolean} Is this request actually synchronous or asynchronous?
     * @param body The body which should be transfered to the Restful service.
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @param onServerError {function(responseText,statusCode,statusMessage)} function executes on a error at the server side.
     * @param onClientError {function(responseText,statusCode,statusMessage)} function executes on a error at the client side.
     * @param onRedirect {function(responseText,statusCode,statusMessage)} function executes if your were redirected.
     * @constructor
     */
    REST.prototype.POST = function (url, synch, body, onSuccess, onServerError, onClientError, onRedirect) {
        request(methods.post, url, synch, onSuccess, body, onRedirect, onClientError, onServerError, null);
    };

    /**
     * PUT updates a existing resource. If the resource doesn't exist it tries to create it.
     *
     * @param url {string} The url to the resource beeing updated.
     * @param synch {boolean} Is this request actually synchronous or asynchronous?
     * @param body The body which should be transfered to the Restful service.
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @param onServerError {function(responseText,statusCode,statusMessage)} function executes on a error at the server side.
     * @param onClientError {function(responseText,statusCode,statusMessage)} function executes on a error at the client side.
     * @param onRedirect {function(responseText,statusCode,statusMessage)} function executes if your were redirected.
     * @constructor
     */
    REST.prototype.PUT = function (url, synch, body, onSuccess, onServerError, onClientError, onRedirect) {
        request(methods.put, url, synch, onSuccess, body, onRedirect, onClientError, onServerError);
    };

    /**
     * DELETE deletes a resource at the given url.
     *
     * @param url {string} Url where the resource should be deleted.
     * @param synch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @param onServerError {function(responseText,statusCode,statusMessage)} function executes on a error at the server side.
     * @param onClientError {function(responseText,statusCode,statusMessage)} function executes on a error at the client side.
     * @param onRedirect {function(responseText,statusCode,statusMessage)} function executes if your were redirected.
     * @param body
     * @constructor
     */
    REST.prototype.DELETE = function (url, synch, body, onSuccess, onServerError, onClientError, onRedirect) {
        request(methods.delete, url, synch, onSuccess, body, onRedirect, onClientError, onServerError);
    };

    /**
     * Collects all metadata of a resource.
     *
     * @param url {string} Url where the resource can be found.
     * @param synch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @param onServerError {function(responseText,statusCode,statusMessage)} function executes on a error at the server side.
     * @param onClientError {function(responseText,statusCode,statusMessage)} function executes on a error at the client side.
     * @param onRedirect {function(responseText,statusCode,statusMessage)} function executes if your were redirected.
     * @constructor
     */
    REST.prototype.HEAD = function (url, synch, onSuccess, onServerError, onClientError, onRedirect) {
        request(methods.head, url, synch, null, null, onRedirect, onClientError, onServerError, onSuccess);
    };


    /**
     * Sends the request for all different types of methods.
     * @param method
     * @param url
     * @param asynchmode
     * @param onReady {function(responseText)}
     * @param onRedirect {function(responseText)}
     * @param onServerError {function(responseText)}
     * @param onClientError {function(responseText)}
     * @param body The body of the request which will be send with it. Can be: ArrayBuffer, ArrayBufferView, Blob, Document,DOMString,FormData, string or empty.
     * @param headerCallback {function(AllHeaders,statusCode,statusMessage)}
     * @return {request}
     */
    function request(method, url, asynchmode, onReady, body, onRedirect, onClientError, onServerError, headerCallback) {
        var xhttp;
        xhttp = new XMLHttpRequest();

        if (properties.debug) {
            console.debug();
        }

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status <= 299) {//successfully requested.
                onReady(xhttp.responseText, xhttp.status, message.successful);

                if (headerCallback != null) {
                    headerCallback(xhttp.getAllResponseHeaders(), xhttp.status, message.successful);
                }
                if (properties.debug) {
                    debugSuccessful(xhttp.status);
                }
            }
            if (xhttp.readyState == 4 && xhttp.status >= 300 && xhttp.status <= 399) {//redirected request. You need inform yourself where the resource was moved.
                onRedirect(xhttp.responseText, xhttp.status, message.redirect);

                if (properties.debug) {
                    debugRedirected(xhttp.status);
                }
            }
            if (xhttp.readyState == 4 && xhttp.status >= 400 && xhttp.status <= 499) {//client error.
                onClientError(xhttp.responseText, xhttp.status, message.clientError);

                if (properties.debug) {
                    debugClientError(xhttp.status);
                }
            }
            if (xhttp.readyState == 4 && xhttp.status >= 500 && xhttp.status <= 599) {//server error.
                onServerError(xhttp.responseText, xhttp.status, message.serverError);

                if (properties.debug) {
                    debugServerError(xhttp.status);
                }
            }
        };

        xhttp.open(method, url, asynchmode);
        if (properties.debug) {
            console.debug(debugMessages.xmlHttpRequestOpened);
        }

        xhttp.send(body);
        if (properties.debug) {
            console.debug(debugMessages.xmlHttpRequestSend);
        }
    }

    function debugSuccessful(status) {
        switch (status) {
            case 200:
                console.debug('DEBUG: 200 OK. Request was successful.');
                break;
            case 201:
                console.debug('DEBUG: 201 Created. Request has been fulfilled, resulting in the creation of a new resource.');
                break;

            case 202:
                console.debug('DEBUG: 202 Accepted. The request has been accepted for processing, but the processing has not been completed. The request might or might not be eventually acted upon, and may be disallowed when processing occurs.');
                break;

            case 203:
                console.debug('DEBUG: 203 Non-Authoritative Information.');
                break;

            case 204:
                console.debug('DEBUG: 204 No Content. The server successfully processed the request and is not returning any content.');
                break;

            case 205:
                console.debug('DEBUG: 205 Reset Content. The server successfully processed the request, but is not returning any content.  Requester needs to reset the document view.');
                break;

            case 206:
                console.debug('DEBUG: 206 Partial Content. ');
                break;

            case 207:
                console.debug('DEBUG: 207 Multi-Status.');
                break;

            case 208:
                console.debug('DEBUG: 208 Already Reported.');
                break;

            case 226:
                console.debug('DEBUG: 226 IM Used.');
                break;
        }
    }

    function debugRedirected(status) {
        switch (status) {
            case 300:
                console.debug('DEBUG: 300 Multiple Choices.');
                break;

            case 301:
                console.debug('DEBUG: 301 Moved Permanently.');
                break;

            case 302:
                console.debug('DEBUG: 302 Found.');
                break;

            case 303:
                console.debug('DEBUG: 303 See Other.');
                break;

            case 304:
                console.debug('DEBUG: 304 Not Modified.');
                break;

            case 305:
                console.debug('DEBUG: 306 Switch Proxy');
                break;

            case 306:
                console.debug('DEBUG: 305 Use Proxy.');
                break;

            case 307:
                console.debug('DEBUG: 307 Temporary Redirect.');
                break;

            case 308:
                console.debug('DEBUG: 308 Permanent Redirect.');
                break;
        }
    }

    function debugServerError(status) {
        switch (status) {
            case 500:
                console.debug('DEBUG: 500 Internal Server Error.');
                break;

            case 501:
                console.debug('DEBUG: 501 Not Implemented.');
                break;

            case 502:
                console.debug('DEBUG: 502 Bad Gateway.');
                break;

            case 503:
                console.debug('DEBUG: 503 Service Unavailable.');
                break;

            case 504:
                console.debug('DEBUG: 504 Gateway Timeout.');
                break;

            case 505:
                console.debug('DEBUG: 505 HTTP Version Not Supported.');
                break;

            case 506:
                console.debug('DEBUG: 506 Variant Also Negotiates.');
                break;

            case 507:
                console.debug('DEBUG: 507 Insufficient Storage.');
                break;

            case 508:
                console.debug('DEBUG: 508 Loop Detected.');
                break;

            case 510:
                console.debug('DEBUG: 510 Not Extended.');
                break;

            case 511:
                console.debug('DEBUG: 511 Network Authentication Required.');
                break;
        }
    }

    function debugClientError(status) {
        switch (status) {
            case 400:
                console.debug('DEBUG: 400 Bad Request.');
                break;

            case 401:
                console.debug('DEBUG: 401 Unauthorized.');
                break;

            case 402:
                console.debug('DEBUG: 402 Payment Required.');
                break;

            case 403:
                console.debug('DEBUG: 403 Forbidden.');
                break;

            case 404:
                console.debug('DEBUG: 404 Not Found.');
                break;

            case 405:
                console.debug('DEBUG: 405 Method Not Allowed.');
                break;

            case 406:
                console.debug('DEBUG: 406 Not Acceptable.');
                break;

            case 407:
                console.debug('DEBUG: 407 Proxy Authentication Required.');
                break;

            case 408:
                console.debug('DEBUG: 408 Request Timeout.');
                break;

            case 409:
                console.debug('DEBUG: 409 Conflict.');
                break;

            case 410:
                console.debug('DEBUG: 410 Gone.');
                break;

            case 411:
                console.debug('DEBUG: 411 Length Required.');
                break;

            case 412:
                console.debug('DEBUG: 412 Precondition Failed.');
                break;

            case 413:
                console.debug('DEBUG: 413 Payload Too Large.');
                break;

            case 414:
                console.debug('DEBUG: 414 URI Too Long.');
                break;

            case 415:
                console.debug('DEBUG: 415 Unsupported Media Type.');
                break;

            case 416:
                console.debug('DEBUG: 416 Range Not Satisfiable.');
                break;

            case 417:
                console.debug('DEBUG: 417 Expectation Failed.');
                break;

            case 418:
                console.debug('DEBUG: 418 I\'m a teapot.');
                break;

            case 421:
                console.debug('DEBUG: 421 Misdirected Request.');
                break;

            case 422:
                console.debug('DEBUG: 422 Unprocessable Entity.');
                break;

            case 423:
                console.debug('DEBUG: 423 Locked.');
                break;

            case 424:
                console.debug('DEBUG: 424 Failed Dependency');
                break;

            case 426:
                console.debug('DEBUG: 426 Upgrade Required');
                break;

            case 428:
                console.debug('DEBUG: 428 Precondition Required.');
                break;

            case 429:
                console.debug('DEBUG: 429 Too Many Requests.');
                break;

            case 431:
                console.debug('DEBUG: 431 Request Header Fields Too Large.');
                break;

            case 451:
                console.debug('DEBUG: 451 Unavailable For Legal Reasons.');
                break;

        }
    }


    return REST;
})();