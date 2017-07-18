# Continous-Restclient

A simple javascript based rest client which helps you to easily access restful services.

## Usage

First of all build an instance of REST:

```javascript
var request = new REST();
```

After that you can start firing request to any service:

```javascript
request.GET("http://host:port/resource",true,
    function (responseText, statusCode, statusMessage) {  
       //do something 
    });
```

There is an implementation for every method a restful service should provide to you.
This is only a small getting started example. visit the wikipages for more detailed information.

