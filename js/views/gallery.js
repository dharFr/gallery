
/*global define: false, Backbone, $, Mustache*/
;(function (global) {

  var app = global.app || {};
  
  // current is the index of the currently displayed photo.
  var current = -1;

  // Gallery View : the main one
  //---------------
  var Gallery = Backbone.View.extend({

    initialize: function(options) {

      this.controller = options.controller;

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
    },

    nextPhoto: function() {
      this.updateIndex( current + 1 );
    },

    prevPhoto: function() {
      this.updateIndex( current - 1 );
    },

    gotoPhoto: function(photoid) {
      var idx = this.model.findIndex(photoid);
      if ( idx !== -1 ) {
        this.updateIndex( idx );
      }
    },

    // Updates the index of the current photo.
    // Notifies the application only when needed
    updateIndex: function(idx) {
      
      var nbPhotos = this.model.getAlbumLength();

      if (idx < 0) idx = nbPhotos + idx;
      var newVal = idx%nbPhotos;
      if (current !== newVal) {
        current = newVal;

        this.imageView.render();
        this.controller.trigger('nav/changed', this.model.getPhoto(current));
      }
    },

    // Returns data associated to the current photo
    currentIndex: function() {
      return current;
    }

  });

  app.views = app.views || {};
  app.views.Gallery = Gallery;
  global.app = app;
})(window);