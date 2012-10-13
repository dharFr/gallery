/*! Backbone Gallery App - v1.0 - 2012-10-14
* Copyright (c) 2012 dhar; Licensed  */

;(function (global){

  var app = global.app || {};

  app.config = app.config || {};
  app.config.fetchUrl = './gallery_data.json';
  
  global.app = app;

})(window);
/*global define: false, Backbone*/
;(function (global) {

  var app = global.app || {};

  var Gallery = Backbone.Model.extend({
    url: app.config.fetchUrl,

    initialize: function() {
    },

    getPhoto: function(idx) {
      return this.get('photos')[idx];
    },

    getAlbumName: function(){
      return this.get('album').name;
    },

    getAlbumLength: function() {
      return this.get('photos').length;
    },

    // Find the index of a photo given is 'id'
    findIndex: function(photoid) {
      for (var i = 0; i < this.get('photos').length; i++) {
        if (photoid === this.get('photos')[i].id) {
          return i;
        }
      }
      return -1;
    }
  });

  app.models = app.models || {};
  app.models.Gallery = Gallery;
  global.app = app;
})(window);

/*global define: false, Backbone, $, Mustache*/
;(function (global) {

  var app = global.app || {};

  // Header View
  //---------------
  var Header = Backbone.View.extend({
    tagName: 'header',
    id: 'header',

    events: {
      "click #prev": "previous",
      "click #next": "next"
    },

    initialize: function(options) {
      this.controller = options.controller;
      this.model.on('change', this.render, this);
    },

    previous: function() {
      this.controller.trigger('nav/prev');
    },
    next: function() {
      this.controller.trigger('nav/next');
    },

    render: function() {
      this.$el.find('h1').text(this.model.getAlbumName());
      return this;
    }
  });

  app.views = app.views || {};
  app.views.Header = Header;
  global.app = app;
})(window);

/*global define: false, Backbone, $, Mustache*/
;(function (global) {

  var app = global.app || {};

  // Image View: handle the main photo in the center of the page
  //---------------
  var MainImage = Backbone.View.extend({

    template: null,

    initialize: function(options) {
      this.controller = options.controller;
    },

    render: function() {

      // Load template if needed
      if (!this.template) {
        this.template = $('#imageTpl').html();
      }

      var idx = this.controller.currentIndex();
      var photo = this.model.getPhoto(idx);
      if (photo) {
        var tpl = Mustache.render(this.template, photo);
        this.$el.html(tpl);
      }
      return this;
    }
  });

  app.views = app.views || {};
  app.views.MainImage = MainImage;
  global.app = app;
})(window);

/*global define: false, Backbone, $, Mustache*/
;(function (global) {

  var app = global.app || {};

  // Thumbnails View
  //----------------
  var Thumbnails = Backbone.View.extend({

    template: null,

    events: {
      "click a": "thumbClicked"
    },

    initialize: function(options) {

      this.controller = options.controller;

      this.model.on('change', this.render, this);

      // Updates the selected thumbnails
      this.controller.router.on('route:photo', this.currentChanged, this);
    },

    thumbClicked: function(e) {
      this.controller.trigger('nav/goto', $(e.currentTarget).attr('photoid'));
      return false;
    },

    // render the picture, using a template this time
    render: function() {

      // Load template if needed
      if (!this.template) {
        this.template = $('#thumbsTpl').html();
      }

      var tpl = Mustache.render(this.template, this.model.toJSON());
      this.$el.html(tpl);
      return this;
    },

    currentChanged: function() {
      var curIdx = this.controller.currentIndex();
      this.$el
        .find('a').removeAttr('aria-selected')
        .filter('[photoid=' + this.model.getPhoto(curIdx).id + ']')
        .attr('aria-selected', 'true');
    }
  });

  app.views = app.views || {};
  app.views.Thumbnails = Thumbnails;
  global.app = app;
})(window);

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

      if (idx < 0) {
        idx = nbPhotos + idx;
      }
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