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
      dist: ['<%= build.dest %>/tests/index.html']
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
        dest: '<%= build.dest %>/js/libs/<%= pkg.name %>-libs.<%= pkg.version %>.js'
      },
      tests: {
        src: [
          '<banner:meta.banner>',
          'js/gallery/config.js',
          'js/gallery/models/gallery.js',
          'js/gallery/views/header.js',
          'js/gallery/views/main-image.js',
          'js/gallery/views/thumbnails.js',
          'js/gallery/views/gallery.js'
        ],
        dest: '<%= build.dest %>/tests/js/<%= pkg.name %>-tests.<%= pkg.version %>.js'
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
        dest: '<%= build.dest %>/js/<%= pkg.name %>-app.<%= pkg.version %>.js'
      }
    },
    min: {
      libs: {
        src: ['<config:concat.libs.dest>'],
        dest: '<%= build.dest %>/js/libs/<%= pkg.name %>-libs.<%= pkg.version %>.min.js'
      },
      tests: {
        src: ['<banner:meta.banner>', '<config:concat.tests.dest>'],
        dest: '<%= build.dest %>/tests/js/<%= pkg.name %>-tests.<%= pkg.version %>.min.js'
      },
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: '<%= build.dest %>/js/<%= pkg.name %>-app.<%= pkg.version %>.min.js'
      }
    },
    targethtml: {
      release: {
        src: 'index.html',
        dest: '<%= build.dest %>/index.html'
      },
      tests: {
        src: 'tests/index.html',
        dest: '<%= build.dest %>/tests/index.html'
      }
    },
    copy: {
      dist: {
        files: {
          "<%= build.dest %>/css/": "css/**",
          "<%= build.dest %>/img/gallery/": "img/gallery/**",
          "<%= build.dest %>/js/libs/bootstrap/": "js/libs/bootstrap/**",
          "<%= build.dest %>/tests/": ["tests/js/**", "tests/libs/**"],
          "<%= build.dest %>/gallery_data.json": "gallery_data.json"
        }
      }
    },
    clean: ["<%= build.dest %>"],

    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit:dev'
    },

    build: {
      dest: 'dist'
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

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Loads grunt-targethtml plugin from local fork
  // see: https://github.com/changer/grunt-targethtml/pull/3
  //grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadTasks('../grunt-targethtml/tasks');

  grunt.registerTask('build', 'clean concat min targethtml copy');
  // Default task.
  grunt.registerTask('default', 'lint qunit:dev build qunit:dist');

};
