HTTP = Package.http && Package.http.HTTP || {};

// Client-side simulation is not yet implemented
HTTP.methods = function(methods) {
  throw new Error('HTTP.methods not implemented on client-side');
};