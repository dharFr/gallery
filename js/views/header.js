
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