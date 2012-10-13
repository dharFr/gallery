/*global define: false, $, _, Backbone, module, expect, test, ok, equal, app */

var galleryTestData = {
  "album": {
    "name": "test album"
  },
  "photos": [
    {
      "id":"1",
      "url":"/path/to/image1.jpg",
      "thumb_url":"path/to/thumb1.jpg",
      "title":"picture1",
      "date":"date1",
      "location":"location1"
    },
    {
      "id":"2",
      "url":"/path/to/image2.jpg",
      "thumb_url":"path/to/thumb2.jpg",
      "title":"picture2",
      "date":"date2",
      "location":"location2"
    }
  ]
};

module("checking dependencies");

test( "Testing namespace definitions", function() {

  expect(8);
  ok( app, "app is defined" );
  ok( app.models, "app.models is defined" );
  ok( app.models.Gallery, "app.models.Gallery is defined" );
  ok( app.views, "app.views is defined" );
  ok( app.views.Header, "app.views.Header is defined" );
  ok( app.views.Thumbnails, "app.views.Thumbnails is defined" );
  ok( app.views.MainImage, "app.views.MainImage is defined" );
  ok( app.views.Gallery, "app.views.Gallery is defined" );
});

module("Model : gallery.js", {

  setup: function(){
    this.model = new app.models.Gallery(galleryTestData);
  }
});

test( "Gallery Model tests", function() {

  expect(4);
  equal( this.model.getAlbumName(), galleryTestData.album.name, "getAlbumName() ok" );
  equal( this.model.getPhoto(0), galleryTestData.photos[0], "getPhoto() ok" );
  equal( this.model.getAlbumLength(), galleryTestData.photos.length, "getAlbumLength() ok");
  equal( this.model.findIndex("2"), 1, "findIndex() ok");
});

module("View : header.js", {

  setup: function(){

    // Listen to events on mock controller
    this.obj = {};
    _.extend( this.obj, Backbone.Events );
    this.obj.unbind(); // remove all custom events before each spec is run.

    this.mockModel = {
      name: "mock name",
      getAlbumName: function() { return this.name; }
    };
    _.extend( this.mockModel, Backbone.Events );
    this.mockModel.unbind();

    $(document.body).append('' +
    '<header id="header">' +
        '<h1></h1>' +
        '<button id="prev">Previous</button>' +
        '<button id="next">Next</button>' +
    '</header>');
  },
  teardown: function(){
    $('#header').remove();
  }
});

test( "Header tests", function(){

  expect(5);

  this.spy(this.mockModel, 'getAlbumName');
  var renderSpy = this.spy(app.views.Header.prototype, 'render');

  var view = new app.views.Header({
    controller: this.obj,
    model: this.mockModel,
    el: '#header'
  });

  this.mockModel.trigger('change');
  ok(view.render.calledOnce, 'view renders on model change');
  ok(this.mockModel.getAlbumName.calledOnce, 'view reads album name from model');
  equal(view.$el.find('h1').text(), this.mockModel.name, 'title is album name');

  renderSpy.restore();

  var prevCallback = this.spy();
  var nextCallback = this.spy();
  this.obj.bind('nav/prev', prevCallback);
  this.obj.bind('nav/next', nextCallback);

  view.$el.find('#prev').click();
  ok(prevCallback.calledOnce, "click on prev triggers 'nav/prev' event");
  view.$el.find('#next').click();
  ok(nextCallback.calledOnce, "click on next triggers 'nav/next' event");

});