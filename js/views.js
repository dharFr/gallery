
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


  // Image View: handle the main photo in the center of the page
  //---------------
  var MainImage = Backbone.View.extend({

    template: null,

    initialize: function(options) {
      this.controller = options.controller;
      this.controller.router.on('route:photo', this.render, this);
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

  // Gallery View : the main one
  //---------------
  var Gallery = Backbone.View.extend({

    initialize: function(options) {

      // Create Header view
      this.headerView = new Header({
        model: this.model,
        controller: options.controller,
        el: '#header'
      });

      // Create Image view
      this.imageView = new MainImage({
        model: this.model,
        controller: options.controller,
        el: '#main-image'
      });

      // Create Thumbnails view
      this.thumbnailsView = new Thumbnails({
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