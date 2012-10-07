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