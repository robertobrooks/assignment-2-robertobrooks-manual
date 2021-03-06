// simple-http-file-server.js
//
// start by navigating to the folder, and type 'node ../simple-http-file-server'
// access the app from you browser at http://localhost:8080/ (add any arbitrary path)

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

//(2) Use third party package in project
var log = require('log-util');
log.verbose('verbose', 0);
log.debug('debug', 1);
log.info('info', 2);
log.warn('warn', 3);
log.error('error', 4);

//(3) Added a n own file-based module
const mimes = require('./getMimeType.js');

var server = http.createServer((req, res) => {
    console.log(req.url);
  

  // parse the URL into its component parts
	const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);
    
  // extract the pathname and query properties
	const { pathname, query } = parsedUrl;

	// output absolute path info
	console.log('__dirname is %s', __dirname);
	console.log('cwd is %s', process.cwd());

  var contentType = 'text/plain';
	// Extract the filename extension
	//  then set the mimetype if it is known
  var extname = String(path.extname(pathname)).toLowerCase();

  //(3) Use function to create contentType
  contentType = mimes.getMimeType(mimes.mimeTypes) || contentType;
	
	// Create an absolute path to the requested file.
	// Assume the server was started from the webroot
	const absolute_path_to_file = path.join(__dirname, pathname);
	console.log('absolute_path_to_file is %s', absolute_path_to_file);

	fs.readFile(absolute_path_to_file, (err, data) => {
		  if (err) {
	      console.log(err);
	      if (err.code == 'ENOENT'){
	        // file does not exist - we should return a 404 status code
					console.log('404 error getting ' + pathname);
					res.writeHead(404, {"Content-Type": "text/plain"});
					res.end('404: Page Not Found!');
	      } else if (err.code == 'EISDIR'){
	        // this is actually a directory - we should create a directory listing
					console.log('directory listing ' + pathname);
					fs.readdir(absolute_path_to_file, (err, files)=>{
						if (err) {
							res.writeHead(500, {"Content-Type": "text/plain"});
							res.end('Server Error 500');
						}
						let s = '<b>Directory Listing</b>';
						files.forEach((i)=>{
							s += (i + "");
						});
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(s, 'utf8');
					});
	      }
	    } else {
		    // If we get to here, 'data' should contain the contents of the file
				res.writeHead(200, contentType);
				res.end(data, 'binary', ()=>{
                    console.log("file delivered: " + pathname);
                    
                //(4) Create the console output for ?name
                    if (parsedUrl.query.name) {
                    console.log("name: " + parsedUrl.query.name);
                    }

				});
		}
	});
});

var port = 8080;
server.listen(port, () => {
  console.log("Listening on " + port);
});