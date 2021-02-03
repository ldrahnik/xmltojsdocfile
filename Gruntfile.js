"use strict";

module.exports = function(grunt) {

    var fs = require("fs");
    var path = require("path");

    // do not print `Running "default" task`
    grunt.log.header = function () {};
    // do not print `Done`
    grunt.log.success = function () {};

    var xmltojsdoc = require("./src/xmltojsdocfile");

    grunt.registerTask('default', function() {
        var inputPath = grunt.option('inputpath');
        var outputPath = grunt.option('outputpath');

        if(inputPath) {

            // from directory
            if(fs.lstatSync(inputPath).isDirectory()) {
                xmltojsdoc.convertDirToOutput(inputPath, outputPath, {
                    commentIsBelowDefinition: true
                });
            }
            // from file
            else if(fs.lstatSync(inputPath).isFile()) {
                xmltojsdoc.convertFileToOutput(path.dirname(inputPath), path.basename(inputPath), outputPath, {
                    commentIsBelowDefinition: true
               });
            } else {
                console.error('Given path is not valid');
            }
        }
    });
};
