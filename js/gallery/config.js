;(function (global){

  var app = global.app || {};

  app.config = app.config || {};
  app.config.fetchUrl = '/gallery_data.json';
  
  global.app = app;

})(window);