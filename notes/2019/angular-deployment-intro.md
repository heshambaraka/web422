---
title: Angular Deployment Introduction
layout: default
---

## Angular Deployment Introduction

Until now, we've been working with our web applications in a local environment.  We have relied on the frameworks (the integrated "development servers" included in React and Angular) to execute our code on *localhost*.  However, sooner or later we will have to build and publish these applications so that they are available for the public to use. 

Fortunately, Angular offers an extremely simple "build" process.

<br>

### Introducing Angular's "Simplest Build Possible"

From the Angular Documentation:

For the simplest deployment, build for development and copy the output directory to a web server.

* Start with the development build

```
ng build
```

* Copy everything within the app folder (ie "myApp") inside output folder (**dist/** by default) to a folder on the server (**NOTE**: do not include the app folder (ie "myApp") - only its contents).  If you copy the files into a server sub-folder, append the build flag, `--base-href` and set the `<base href...` (in the index.html file) appropriately.

  For example, if the index.html is on the server at `/my/app/index.html`, set the base href to `<base href="/my/app/">`, and the build command is:

  ```
  ng build --base-href=/my/app/
  ```

  You'll see that the `<base href...` is set properly in the generated dist/myApp/index.html file (assuming your app is "myApp").
  
  If you copy to the server's root directory (*which we will be doing*), omit this step and leave the `<base href...` alone.
  
  Learn more about the role of `<base href...` [here](https://angular.io/guide/deployment#base-tag).

* Configure the server to *redirect requests for missing files to **index.html***

<br>

### Applying this to our "MEAN" Stack Heroku Deployment

Recall, back in WEB322, we used Node.js with the Express module to create a web server (for a quick refresher, see the ["Getting Started with Heroku Guide"](https://web322.ca/getting-started-with-heroku)).  In effect, we were able to create an extremely simple web server with the following code:

```js
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
```

If you're following along with the code, create this server now (you should be able to see the the webserver running on http://localhost:8080)

However, our task is not to return the text "hello world" on the "/" route, but instead to serve up our Angular application!

Therefore, we need to configure the server.js file (from the example above) to work with a "public" directory, ie (from the ["Static Server"](https://github.com/sictweb/web422/tree/master/Code%20Examples/static-server) code example):

```js
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// setup the static folder 
app.use(express.static("public")); 

// Start the server
app.listen(HTTP_PORT, function(){
    console.log("Server listening on port: " + HTTP_PORT);
});
```

This "public" directory will serve up all of the files from our newly built Angular app, ie the "/dist/myApp" directory (the files should resemble the following list):

```
favicon.ico
index.html
inline.js
inline.js.map
main.js
main.js.map
polyfills.js
polyfills.js.map
styles.js
styles.js.map
vendor.js
vendor.js.map
```

Now, we can simply place the entire *contents* of the "dist/myApp" directory (not the folder itself), into a "public" folder for our Node.js server (the "public" directory should be placed beside the server.js file, ie: in the same directory).

If we now run our updated server, we should see our Angular application running!

However, there is a problem.  What if we try to access one of our Angular routes directly, ie: **localhost:8080/lizard**, we will see an error along the lines of: 

```
Cannot GET /lizard
```

This is because we technically haven't configured a route on our server.js file to respond to a request for /lizard.  We're letting Angular handle this complexity.  

To remedy this situation and place the routing **back** in the hands of the Angular router, we must add our familiar 404 middleware solution in our server.js file.  

However, instead of sending an **error message** back to the user, we instead **redirect** them to our Angular application start page "index.html".  As you will recall from WEB322, this requires the use of the built-in "path" module:

```js
var express = require("express");
var app = express();

var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

// setup the static folder 
app.use(express.static("public")); 

// handle "404" errors
app.use((req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Start the server
app.listen(HTTP_PORT, function(){
    console.log("Server listening on port: " + HTTP_PORT);
});
```

If we rebuild the server and try again, we will see that the routing does indeed work as expected.  The route is not found in our Express app, so it simply redirects to the Angular app with the route intact.  Even our Angular 404 handler will still work as expected.

From here, we can push our Node/Express server to Heroku, just as we have done in WEB322!

<br>

### Optimizing for production

The official documentation has the following information on generating an optimized build:

Although deploying directly from the development environment works, you can generate an optimized build with additional CLI command line flags, starting with `--prod`.

Build with --prod

```
ng build --prod
```

The `--prod` meta-flag engages the following optimization features.

* [Ahead-of-Time (AOT) Compilation](https://angular.io/guide/aot-compiler): pre-compiles Angular component templates.
* [Production mode](https://angular.io/guide/deployment#enable-prod-mode): deploys the production environment which enables production mode.
* Bundling: concatenates your many application and library files into a few bundles.
* Minification: removes excess whitespace, comments, and optional tokens.
* Uglification: rewrites code to use short, cryptic variable and function names.
* Dead code elimination: removes unreferenced modules and much unused code.
* The remaining copy deployment steps are the same as before.

**Note:** if we try building our app with the `--prod` flag, we will see that the files generated in the "dist/myApp" folder are very different, ie:

```
3rdpartylicenses.txt
favicon.ico
index.html
main.98bd75b2641a70e7f292.js
polyfills.9d3a8743be9f041e6ba8.js
runtime.ec2944dd8b20ec099bf3.js
styles.3ff695c00d717f2d2a11.css
```

You may further reduce bundle sizes by adding the build-optimizer flag.

```
ng build --prod --build-optimizer
```

See the [CLI Documentation](https://github.com/angular/angular-cli/wiki/build) for details about available build options and what they do.

<br>