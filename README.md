# PWA with pyodide support 

In this POC we are trying to prove that we are able to fully use the product modules for the illustration system in an offline manner.

For this i made a simple PWA app that has:
1. Service worker that caches every request it intercepts and continues to serve ever subsequent request from the cache instead of using the network.
2. PyWorker that starts a pyodide environment and preloads pandas and numpy in it
3. index.html & index.js files that are representing the POC app(aka python shell)

## How to test


The best way to test is to first to start a http server (for example running `python3 -m http.server`) in the root directory of the project
### 1. Sanity check
Once started you should be able to execute arbitrary python commands that are written in the text area on the index.html page.
### 2. PWA check
You should be able to see a small icon in the link text field of the browser which by clicking it should create a 'desktop' app
### 3. Offline check
If you shut down the server and refresh the app or the browser it should still be able to load it, and work the same as before with no sideeffects.



  
