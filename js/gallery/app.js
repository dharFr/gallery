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
    this.on('nav/prev', function(){ this.view.prevPhoto(); }, this);
    this.on('nav/next', function(){ this.view.nextPhoto(); }, this);
    this.on('nav/goto', function(photoid) { this.view.gotoPhoto(photoid); }, this);

    this.on('nav/changed', function(photo) {
        this.router.navigate('/photo/'+ photo.id, {trigger: true});
    });

    this.model.on('change', function() {

      Backbone.history.start();
      //Backbone.history.start({pushState: true});

      // If current isn't set after starting history (ie: updateIndex() hasn't been called)
      // Update it with first pict
      if (this.currentIndex() === -1) {
        this.view.updateIndex(0);
      }

    }, this);

    this.model.fetch();

    this.currentIndex = this.view.currentIndex;
  };
  _.extend(GalleryApp.prototype, Backbone.Events);

  var gallery = new GalleryApp();
})(window);