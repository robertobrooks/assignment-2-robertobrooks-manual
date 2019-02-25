const mimeTypes = {
    'html' : "text/html",
    'css'  : "text/css",
    'js'   : "text/javascript",
    'png'  : "image/png",
    'jpg'  : "image/jpg"
  };

  function getMimeType(ext) {
    switch (ext) {
    case 'html': return "text/html";
    case 'css' : return "text/css";
    case 'js' : return "text/javascript";
    case 'png' : return "image/png";
    case 'jpg' : return "image/jpg";
    }
  };

  module.exports.getMimeType = getMimeType;
