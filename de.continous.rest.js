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
        xmlHttpRequestOpened: "DEBUG: Request was opened.",
        xmlHttpRequestSendWithoutBody:"DEBUG: Request was send without body."
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

    /**
     * Basic Constructor.
     * @constructor
     */
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
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.GET = function (url, asynch, onSuccess) {
        request(methods.get,url,asynch,onSuccess,null,null);
    };

    /**
     * Creates new resource on the server. ResponseText provides a link to the newly created resource on the Restful service.
     *
     * @param url {string} Url where the new resource should be created.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param body The body which should be transfered to the Restful service.
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.POST = function (url, asynch, body, onSuccess) {
        request(methods.post,url,asynch,onSuccess,body,null);
    };

    /**
     * PUT updates a existing resource. If the resource doesn't exist it tries to create it.
     * When it doesn't exist, it will return a link to the newly created resource.
     *
     * @param url {string} The url to the resource beeing updated.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param body The body which should be transfered to the Restful service.
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.PUT = function (url, asynch, body, onSuccess) {
        request(methods.put,url,asynch,onSuccess,body,null);
    };

    /**
     * DELETE deletes a resource at the given url.
     *
     * @param url {string} Url where the resource should be deleted.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.DELETE = function (url, asynch, onSuccess) {
        request(methods.delete,url,asynch,onSuccess,null,null);
    };

    /**
     * Collects all metadata of a resource.
     *
     * @param url {string} Url where the resource can be found.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.HEAD = function (url, asynch, onSuccess) {
        request(methods.head,url,asynch,null,null,onSuccess);
    };

    /**
     * Sends the request for all different types of methods.
     * @param method
     * @param url
     * @param asynchmode
     * @param onReady {function(responseText)}
     * @param body The body of the request which will be send with it. Can be: ArrayBuffer, ArrayBufferView, Blob, Document,DOMString,FormData, string or empty.
     * @param headerCallback {function(AllHeaders,statusCode,statusMessage)}
     * @return {request}
     */
    function request(method, url, asynchmode, onReady, body, headerCallback) {
        var xhttp;
        xhttp = new XMLHttpRequest();


        if (properties.debug) {
            console.debug("started request using debug mode.");
        }

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status <= 299) {//successfully requested.

                if (onReady!=null){
                    onReady(xhttp.responseText, xhttp.status, message.successful);
                }

                if (headerCallback != null) {
                    headerCallback(xhttp.getAllResponseHeaders(), xhttp.status, message.successful);
                }
                if (properties.debug) {
                    debugSuccessful(xhttp.status);
                }
            }
        };

        xhttp.open(method, url, asynchmode);
        if (properties.debug) {
            console.debug(debugMessages.xmlHttpRequestOpened);
        }

        if (body == null) {
            xhttp.send();
            if (properties.debug) {
                console.debug(debugMessages.xmlHttpRequestSendWithoutBody);
            }
        } else if (body != null) {

            xhttp.send(body);
            if (properties.debug) {
                console.debug(debugMessages.xmlHttpRequestSend);
            }
        }
    }


    return REST;
})();
