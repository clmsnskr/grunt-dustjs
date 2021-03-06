/*
 * grunt-dustjs
 * https://github.com/STAH/grunt-dustjs
 *
 * Copyright (c) 2013 Stanislav Lesnikov
 * Licensed under the MIT license.
 * https://github.com/STAH/grunt-dustjs/blob/master/LICENSE-MIT
 */


module.exports = function (grunt) {
  "use strict";

  grunt.registerMultiTask("dustjs", "Grunt task to compile Dust.js templates.", function () {
    // Extend with the default options if none are specified
    var options = this.options({
        fullname: false
    });

    this.files.forEach(function (file) {
      var srcFiles = grunt.file.expandFiles(file.src),
          taskOutput = [];

      srcFiles.forEach(function (srcFile) {
        var sourceCode = grunt.file.read(srcFile),
            sourceCompiled = compile(sourceCode, srcFile, options.fullname);

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n"));
        grunt.verbose.writeln("[dustjs] Compiled " + grunt.log.wordlist(srcFiles.toString().split(","), {color: false}) + " => " + file.dest);
        grunt.verbose.or.writeln("[dustjs] Compiled " + file.dest);
      }
    });
  });

  function compile (source, filepath, fullFilename) {
    var path = require("path"),
        dust = require("dustjs-linkedin"),
        name;

    if (typeof fullFilename === "function") {
      name = fullFilename(filepath);
    } else if (fullFilename) {
      name = filepath;
    } else {
      // Sets the name of the template as the filename without the extension
      // Example: "fixtures/dust/one.dust" > "one"
      name = path.basename(filepath, path.extname(filepath));
    }

    if (name !== undefined) {
      try {
        return dust.compile(source, name);
      } catch (e) {
        grunt.log.error(e);
        grunt.fail.warn("Dust.js failed to compile.");
      }
    }

    return '';
  }
};
