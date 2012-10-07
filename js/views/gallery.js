
/*global define: false, Backbone, $, Mustache*/
;(function (global) {

  var app = global.app || {};

  // Gallery View : the main one
  //---------------
  var Gallery = Backbone.View.extend({

    initialize: function(options) {

      // Create Header view
      this.headerView = new app.views.Header({
        model: this.model,
        controller: options.controller,
        el: '#header'
      });

      // Create Image view
      this.imageView = new app.views.MainImage({
        model: this.model,
        controller: options.controller,
        el: '#main-image'
      });

      // Create Thumbnails view
      this.thumbnailsView = new app.views.Thumbnails({
        model: this.model,
        controller: options.controller,
        el: '#thumbnails'
      });
    }
  });

  app.views = app.views || {};
  app.views.Gallery = Gallery;
  global.app = app;
})(window);