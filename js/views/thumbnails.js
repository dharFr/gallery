
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