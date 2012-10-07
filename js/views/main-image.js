
/*global define: false, Backbone, $, Mustache*/
;(function (global) {

  var app = global.app || {};

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

  app.views = app.views || {};
  app.views.MainImage = MainImage;
  global.app = app;
})(window);