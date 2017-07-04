var REST = (function () {

    var properties = {
        errorMassage: "Request failed",
        debug: false
    };

    var debugMessages={
        requestStateSuccessful:"DEBUG: State changed: Request was successful.",
        requestStateRedirected:"DEBUG: State changed: Redirected.",
        requestStateClientError:"DEBUG: St",
        requestStateServerError:"",
        xmlHttpRequestSend:"",
        xmlHttpRequestOpened:""
    };

    var message = {
        successful:"SUCCESS: successfully requested.",
        serverError:"ERROR: Server didn\'t respond to your request.",
        clientError:"ERROR: Client was NOT able to perform the request.",
        redirect:"ERROR: Redirected."
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
     * Sends a get request to consume data from a Restful service.
     *
     * @param url The url to the Restful service
     * @param synchmode {boolean} Is this request actually synchronous or asynchronous?
     * @param func {function(responseText)} the callback function which executed something if the request was successfully. It also gets the requests responsetext injected as parameter.
     * @return {request}
     */
    REST.prototype.GET = function (url, synchmode, func) {
        return request(methods.get, url, synchmode, func);
    };

    /**
     * Creates new resource on the server. ResponseText provides a link to the newly created resource on the Restful service.
     * @param url The url to the resource which should be created on the Restful service.
     * @param synchmode {boolean} Is this request actually synchronous or asynchronous?
     * @param func {function(responseText)} the callback function which executed something if the request was successfully. It also gets the requests responsetext injected as parameter.
     * @param body The body which should be transfered to the Restful service.
     * @constructor
     */
    REST.prototype.POST = function (url, synchmode, func, body) {
        request(methods.post, url, asynchmode, func, body);
    };

    //updates a resource or creates it if it doesn't exists.
    REST.prototype.PUT = function () {

    };

    //deletes the resouce on the given direction.
    REST.prototype.DELETE = function () {

    };

    //collects metadata of a resource.
    REST.prototype.HEAD = function () {

    };

    /**
     * Not implemented yet. todo: implement.
     * @constructor
     */
    REST.prototype.OPTIONS = function () {
        console.error('ERROR: not implemented yet. This functionality currently hasn\'t any effect at all.')
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
     * @return {request}
     */
    function request(method, url, asynchmode, onReady, body, onRedirect, onClientError, onServerError) {
        var xhttp;
        xhttp = new XMLHttpRequest();

        if (properties.debug) {
            console.debug();
        }

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status <= 299) {//successfully requested.
                var successfulMessage = "";
                onReady(xhttp.responseText,xhttp.status,successfulMessage);

                if (properties.debug) {
                    console.debug();
                }
            }
            if (xhttp.readyState == 4 && xhttp.status >= 300 && xhttp.status <= 399) {//redirected request. You need inform yourself where the resource was moved.
                var redirectMessage = "";
                onRedirect(xhttp.responseText,xhttp.status,redirectMessage);

                if (properties.debug) {
                    console.debug();
                }
            }
            if (xhttp.readyState == 4 && xhttp.status >= 400 && xhttp.status <= 499) {//client error.
                var clientErrorMessage = "";
                onClientError(xhttp.responseText,xhttp.status,clientErrorMessage);

                if (properties.debug) {
                    console.debug();
                }
            }
            if (xhttp.readyState == 4 && xhttp.status >= 500 && xhttp.status <= 599) {//server error.
                var serverErrorMessage = "";
                onServerError(xhttp.responseText,xhttp.status,serverErrorMessage);

                if (properties.debug) {
                    console.debug();
                }
            }
        };

        xhttp.open(method, url, asynchmode);
        if (properties.debug) {
            console.debug();
        }

        xhttp.send(body);
        if (properties.debug) {
            console.debug();
        }

    }


    return REST;
})();