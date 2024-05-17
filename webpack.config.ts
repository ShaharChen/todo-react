import path from 'path';

module.exports = {
  // other webpack configurations...
  resolve: {
    fallback: {
      "child_process": false,
      "dns": false,
      "fs": false,
      "http": false,
      "timers": false,
      "tls": false,
      "url": false,
      "zlib": false
    }
  }
};