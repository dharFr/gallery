/*global define: false, Backbone, _ */
;(function (global) {

  var app = global.app || {};

  // App initialisation
  var GalleryRouter = Backbone.Router.extend({

    routes: {
      "photo/:id":"photo"
    },

    initialize: function(options) {

      this.controller = options.controller;
    },

    photo: function(id) {
      this.controller.trigger('nav/goto', id);
    }

  });

  var GalleryApp = function(options) {

    this.model = new app.models.Gallery();
    this.router = new GalleryRouter({
      controller: this
    });
    this.view = new app.views.Gallery({
      model: this.model,
      controller: this
    });

    // Listen to 'prev', 'next' and 'goto' events
    // to update the current photo index if required
    this.on('nav/prev', function(){ this.updateIndex( current - 1 ); }, this);
    this.on('nav/next', function(){ this.updateIndex( current + 1 ); }, this);
    this.on('nav/goto', function(photoid) {
      var idx = this.model.findIndex(photoid);
      if ( idx !== -1 ) {
        this.updateIndex( idx );
      }
    }, this);

    this.model.on('change', function() {

      Backbone.history.start();
      //Backbone.history.start({pushState: true});

      // If current isn't set after starting history (ie: updateIndex() hasn't been called)
      // Update it with first pict
      if (current === -1) {
        this.updateIndex(0);
      }

    }, this);

    this.model.fetch();

    // current is the index of the currently displayed photo.
    var current = -1;

    // Updates the index of the current photo.
    // Notifies the application only when needed
    this.updateIndex = function(idx) {
      
      var nbPhotos = this.model.getAlbumLength();

      if (idx < 0) idx = nbPhotos + idx;
      var newVal = idx%nbPhotos;
      if (current !== newVal) {
        current = newVal;
        this.router.navigate('/photo/'+ this.model.getPhoto(current).id, {trigger: true});
      }
    };

    // Returns data associated to the current photo
    this.currentIndex = function() {
      return current;
    };
  };
  _.extend(GalleryApp.prototype, Backbone.Events);

  var gallery = new GalleryApp();
})(window);