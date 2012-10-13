# Gallery

A simple gallery web app used as a playground to try backbone, qunit, grunt.

Initially I built this small application to try [Backbone.JS][backbone] library. Later, I used it asa code base to play with [Grunt][grunt] on a concrete case.

## Dependencies

I currently use the following grunt plugins :
 - [grunt-contrib-clean][grunt-contrib-clean]
 - [grunt-contrib-copy][grunt-contrib-copy]
 - [grunt-targethtml][grunt-targethtml]

For now, as the original version didn't fit mt needs, I used my own [forked version](https://github.com/dharFr/grunt-targethtml) of grunt-targethtml plugin. Until my (merged) [fix](https://github.com/changer/grunt-targethtml/pull/3) has not been published on *npm*, you'll have to clone my version to run the `targethtml` task.

## Install

Just [clone][clone] the repo. You already know how to do this, right? Then you'll probably need to run `npm install` in the root folder to install grunt dependencies.

## Tasks

As the app build system is based on [Grunt][grunt], there's several usefull tasks to know about:

 - `clean`: Removes the `dist` folder
 - `build`: Build the app into the `dist` folder
 - `clean-build`: clean then build
 - Default task is defined to `lint qunit:dev build qunit:dist`. Which means: lint the code, run the tests on dev version, build the app and run the tests again on the built version.

## See it in action

The built app lives in the `gh-pages` branch. You can give it a try on the [demo][demo] page.

[backbone]: http://documentcloud.github.com/backbone/ "Backbone.js"
[grunt]: http://gruntjs.com/ "Grunt"

[grunt-contrib-clean]: https://github.com/gruntjs/grunt-contrib-clean "grunt-contrib-clean"
[grunt-contrib-copy]: https://github.com/gruntjs/grunt-contrib-copy "grunt-contrib-copy"
[grunt-targethtml]: https://github.com/changer/grunt-targethtml "grunt-targethtml"

[clone]: https://help.github.com/articles/duplicating-a-repo "github:help - Duplicating a repo"
[demo]: http://dharFr.github.com/gallery "Gallery Demo"