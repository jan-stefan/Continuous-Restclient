var REST = (function () {

    var properties = {
        errorMassage: "Request failed",
        debug: false,
        authenticationHeaderName:"authenticate"
    };

    var debugMessages = {
        requestStateSuccessful: "DEBUG: State changed: Request was successful.",
        xmlHttpRequestSend: "DEBUG: Request was send.",
        xmlHttpRequestOpened: "DEBUG: Request was opened.",
        xmlHttpRequestSendWithoutBody: "DEBUG: Request was send without body.",
        requestStarted: "started request using debug mode."
    };

    var message = {
        successful: "SUCCESS: successfully requested."
    };

    var methods = {
        get: "GET",
        post: "POST",
        put: "PUT",
        delete: "DELETE",
        head: "HEAD",
        options: "OPTIONS",
        trace: "TRACE"
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

    // noinspection JSValidateJSDoc
    /**
     * Sends a get request to consume data from a Restful service.
     *
     * @param url {string} Url where the resource should be found.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.GET = function (url, asynch, onSuccess) {
        request(methods.get, url, asynch, onSuccess, null, null,null,null);
    };

    // noinspection JSValidateJSDoc
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
        request(methods.post, url, asynch, onSuccess, body, null,null,null);
    };

    // noinspection JSValidateJSDoc
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
        request(methods.put, url, asynch, onSuccess, body, null,null,null);
    };

    // noinspection JSValidateJSDoc
    /**
     * DELETE deletes a resource at the given url.
     *
     * @param url {string} Url where the resource should be deleted.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.DELETE = function (url, asynch, onSuccess) {
        request(methods.delete, url, asynch, onSuccess, null, null,null,null);
    };

    // noinspection JSValidateJSDoc
    /**
     * Collects all metadata of a resource.
     *
     * @param url {string} Url where the resource can be found.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.HEAD = function (url, asynch, onSuccess) {
        request(methods.head, url, asynch, null, null, onSuccess,null,null);
    };


    // noinspection JSValidateJSDoc
    /**
     * Options method receives all options which are available when interacting with a resource.
     * @param url {string} Url where the resource can be found.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request. The injected responseText includes the options.
     * @constructor
     */
    REST.prototype.OPTIONS = function (url, asynch, onSuccess) {
        request(methods.options, url, asynch, onSuccess, null, null,null,null);
    };


    // noinspection JSValidateJSDoc
    /**
     * Trace methods fires a standard request but gets returned what the restservice receives on the other side.
     *
     * @param url {string} Url where the resource can be found.
     * @param body The body which should be transfered to the Restful service.
     * @param asynch {boolean} Is this request actually synchronous or asynchronous?
     * @param onSuccess {function(responseText,statusCode,statusMessage)} function executes on a successful request.
     * @constructor
     */
    REST.prototype.TRACE = function (url, body, asynch, onSuccess) {
        request(methods.trace, url, asynch, onSuccess, body, null,null,null);
    };

    /**
     * Auhtenticates a user using username and password. The username an password will be combined into a new string send via a header called: "authenticate" and send to the given url.
     * This request uses the POST method but is actually not intended to create a resource.
     * It provides the ability of getting a response body which can be used as implemented by you or the system behind this client.
     * There is no encryption at this point so it's recommanded to encrypt the data before sending it to the server.
     * The username and password phrase will be seperated by a colon. So do not use colons in the encrypted phrases.
     * @param url {string} Url where the authentication will happen
     * @param body {string} Can be any content or extra information you might need for authentication.
     * @param asynch {boolean}  Is this request actually synchronous or asynchronous?
     * @param username {string} The username which will be transfered in the header. You should encrypt this before transfering it.
     * @param password {string} The passward which will be transfered using the header. You should encrypt this before transfering it.
     * @param onSuccess {function(responseText,statusCode,statusMessage)} callback function that executes on a successful request.
     */
    REST.prototype.authenticate = function (url,body,asynch,username,password,onSuccess) {
        var headerValue = (username + ":" + password);
        request(methods.post,url,asynch,onSuccess,body,null,properties.authenticationHeaderName,headerValue);
    };


    REST.prototype.requestTokenSet = function (username,password) {
        //todo implement
    };

    REST.prototype.refreshTokenSet = function (refreshToken) {
        //todo implement
    };


    // noinspection JSValidateJSDoc
    /**
     * Sends the request for all different types of methods.
     * @param method
     * @param url
     * @param asynchmode
     * @param onReady {function(responseText, statusCode, statusMessage)}
     * @param body The body of the request which will be send with it. Can be: ArrayBuffer, ArrayBufferView, Blob, Document,DOMString,FormData, string or empty.
     * @param headerCallback {function(responseText, statusCode, statusMessage)}
     * @param headerName {string} The name of the header which will identify the header you'll send.
     * @param headerValue {string} the value of the newly created header.
     * @return {request}
     */
    function request(method, url, asynchmode, onReady, body, headerCallback,headerName,headerValue) {
        var request;
        request = new XMLHttpRequest();


        if (properties.debug) {
            console.debug(debugMessages.requestStarted);
        }

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status >= 200 && request.status <= 299) {//successfully requested.

                if (onReady !== null) {
                    //injecting parameters for later use in callback function
                    // noinspection JSCheckFunctionSignatures
                    onReady(request.responseText, request.status, message.successful);
                }

                if (headerCallback !== null) {
                    //injecting parameters for later use in callback function
                    // noinspection JSCheckFunctionSignatures
                    headerCallback(request.getAllResponseHeaders(), request.status, message.successful);
                }
            }
        };

        request.open(method, url, asynchmode);
        if (properties.debug) {
            console.debug(debugMessages.xmlHttpRequestOpened);
        }

        if (headerName !== null && headerValue !== null){
            request.setRequestHeader(headerName,headerValue);
        }

        if (body === null) {
            request.send();
            if (properties.debug) {
                console.debug(debugMessages.xmlHttpRequestSendWithoutBody);
            }
        } else if (body !== null) {

            request.send(body);
            if (properties.debug) {
                console.debug(debugMessages.xmlHttpRequestSend);
            }
        }
    }

    return REST;
})();

// var request = new XMLHttpRequest();
//
// request.onreadystatechange = function () {
//     if (request.readyState === 4 && request.status >= 200 && request.status <= 299) {//successfully requested.
//
//         console.log(request.responseText);
//     }
// };
// request.open("POST", "http://localhost:8080/login", true);
// request.setRequestHeader("authorization","username=stuffel95:password=pass1234");
// request.send();
//

//example authentication
// var client = new REST();
// client.authenticate("http://localhost:8080/login","school1",true,"stuffel95","passwort1234",function (responseText) {
//     console.log("Response was: " + responseText);
// });