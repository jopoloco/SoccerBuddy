import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";

import "../imports/api/searches";
import "../imports/api/users";
import "../imports/startup/simple-schema-configuration";

Meteor.startup(() => {
    // code to run on server at startup
    WebApp.connectHandlers.use((request, response, next) => {
        //request is the URL we receive. response is the response we send back. next is a function that tells server what to do (continue on normally)
        // console.log("this is from our custom MW");
        // console.log(request.url); // this is the url we receive
        // console.log(request.method); // http method being used
        // console.log(request.headers);
        // console.log(request.query);
        // set http status code
        // response.statusCode = 404;
        // set headers
        // response.setHeader('my-custom-header', 'john was here!'); // name of the header, value of the header (you can create custom headers)
        // set body
        // response.write('<h1>This is my middleware at work!</h1>'); //completely replaces HTML
        // end request
        // response.end(); // immediately terminates response, meaning actual site content won't be returned
        next();
    });
});
