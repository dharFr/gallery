/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'js/gallery/**/*.js', 'tests/js/**/*.js']
    },
    qunit: {
      dev: ['tests/index.html'],
      dist: ['tests/index-dist.html']
    },
    concat: {
      libs: {
        src: [
          "js/libs/json2.js",
          "js/libs/jquery-1.8.2.min.js",
          "js/libs/mustache-0.7.js",
          "js/libs/underscore-1.4.1.min.js",
          "js/libs/backbone-0.9.2.min.js"
        ],

        dest: 'dist/<%= pkg.name %>-libs.<%= pkg.version %>.js'
      },
      dist: {
        src: [
          '<banner:meta.banner>',
          'js/gallery/config.js',
          'js/gallery/models/gallery.js',
          'js/gallery/views/header.js',
          'js/gallery/views/main-image.js',
          'js/gallery/views/thumbnails.js',
          'js/gallery/views/gallery.js',
          'js/gallery/app.js'
        ],

        dest: 'dist/<%= pkg.name %>-app.<%= pkg.version %>.js'
      }
    },
    min: {
      libs: {
        src: ['<config:concat.libs.dest>'],
        dest: 'dist/<%= pkg.name %>-libs.<%= pkg.version %>.min.js'
      },
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-app.<%= pkg.version %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit:dev'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit:dev concat min qunit:dist');

};
