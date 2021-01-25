"use strict";

var fs = require("fs");
var path = require("path");
var XMLToJsDoc = require("@peopleinneed/xmltojsdoc");

var defaultOptions = exports.defaultOptions = {
    commentIsBelowDefinition: false
};

var options = {};

function getFilesInternal(dir, baseDir, files) {
    fs.readdirSync(dir).forEach(function(subDirOrFile) {
        var subDirOrFilePath = path.resolve(path.join(dir, subDirOrFile));

        if(fs.lstatSync(subDirOrFilePath).isDirectory()) {
            getFilesInternal(subDirOrFilePath, baseDir, files);
        } else if(fs.lstatSync(subDirOrFilePath).isFile()) {
            var dirOrFilePathRelativeToBaseDir = subDirOrFilePath.replace(path.resolve(baseDir), '');
            files.push(dirOrFilePathRelativeToBaseDir);
        }
    });
}

// function go recursively throught given dir and returns relative filepaths to given dir
function getFiles(dir, files) {
    getFilesInternal(dir, dir, files);
}

exports.convertDirToOutput = function(inputDirPath, outputFileOrDirPath, customOptions) {
    var relativeInputFilePathsToInputDirPath = [];

    getFiles(inputDirPath, relativeInputFilePathsToInputDirPath);

    relativeInputFilePathsToInputDirPath.forEach((relativeInputFilePathToInputDirPath) => {

        var inputFilePath = path.join(inputDirPath, relativeInputFilePathToInputDirPath);
        var output = exports.convertFile(inputFilePath, customOptions);
    
        if(output) {
            writeOutputToOutput(output, relativeInputFilePathToInputDirPath, outputFileOrDirPath, true);        
        }
    });
}

function writeOutputToOutput(output, relativeInputFilePathToInputDirPath, outputFileOrDirPath, isInputDir) {

    // outputpath is not given (print to standard output)
    if(!outputFileOrDirPath) {
        console.log(output);
    } else {

        // has extension used for file/dir check
        var isOutputPathFile = path.extname(outputFileOrDirPath) ? true : false;
        var outputFileDir = isOutputPathFile ? path.dirname(outputFileOrDirPath) : path.join(outputFileOrDirPath, path.dirname(relativeInputFilePathToInputDirPath));

        // if directory is given (create the same file as input was)
        var outputFilePath = isOutputPathFile ? outputFileOrDirPath : path.join(outputFileOrDirPath, relativeInputFilePathToInputDirPath);

        // create dir where file will be placed
        try {
            if (!fs.existsSync(outputFileDir)) {
                fs.mkdirSync(outputFileDir, { recursive: true });
            }
        } catch(err) {
            return console.log(err);
        }

        // if is input dir (with possible multiple files) and output is file (append)
        if(isInputDir && isOutputPathFile) {
            try {
                fs.appendFileSync(outputFilePath, output);
            } catch(err) {
                return console.log(err);
            }
        } else {
            try {
                fs.writeFileSync(outputFilePath, output);
            } catch(err) {
                return console.log(err);
            }
        }
    }
}

exports.convertFileToOutput = function(inputDirPath, relativeInputFilePathToInputDirPath, outputFileOrDirPath, customOptions) {
    
    var inputFilePath = path.join(inputDirPath, relativeInputFilePathToInputDirPath);
    var output = exports.convertFile(inputFilePath, customOptions);

    if(output) {
        writeOutputToOutput(output, relativeInputFilePathToInputDirPath, outputFileOrDirPath);        
    }
}

exports.convertFile = function(filePath, customOptions) {
    options = customOptions || {};
    for (var o in defaultOptions)  {
        if (!options.hasOwnProperty(o)) {
            options[o] = defaultOptions[o];
        }
    }
    try {
        var content = fs.readFileSync(path.resolve(filePath), {encoding: 'utf-8'});
    } catch(err) {
        console.log(err);
    }

    if(content)
        return parseCommentsFromFile(content.toString(), options);
}

var outputQueue = [];

// Parses a file and picks out the comment blocks
function parseCommentsFromFile(str, options) {
    var lines = str.split('\n');
    var currentBlock = [];
    var beginLine = 0;
    var endLine = 0;
    var addToQueue = function _addToQueue() {
        // Add to list of comments
        outputQueue.push({
            beginLine: beginLine,
            endLine: endLine,
            content: currentBlock.join('\n')
        });
    };

    lines.forEach(function (line, i) {
        line = line.trim();

        // We're in a comment block
        if (/^\/\/\//.test(line)) {
            currentBlock.push(line);

            if (beginLine === 0) {
                beginLine = i + 1;
            }
        }
        // Previous block has finished
        else if (currentBlock.length) {
            endLine = i;
            addToQueue();

            // Reset so we can build the next block
            currentBlock = [];
            beginLine = 0;
            endLine = 0;
        }
    });

    // Check if we were still within a comment at the last line
    if (currentBlock.length) {
        endLine = lines.length;
        addToQueue();
    }

    return processQueue(lines, options);
}

function convert(str) {
    var result = '';

    try {
        result = XMLToJsDoc.convert(str);
    }
    catch (e) {
        console.log(e);
    }

    return result;
}

/**
 * Print all output
*/
function processQueue(lines, options) {

    var results = [];

    var block;
    var lastBlockEndLine = 0;

    if (outputQueue.length) {

        // loop through each comment block in the queue
        while (block = outputQueue.shift()) {

            // read lines indexed from 0
            // blocks are indexed from 1
            var i = lastBlockEndLine;
            var end_i = options.commentIsBelowDefinition ? block.beginLine - 2 : block.beginLine - 1;
            for (;i < end_i; i++) {
                results.push(lines[i]);
            }

            // print converted JS comment
            results.push(convert(block.content));

            // swap comment from the below of the definition above the definition
            if(options.commentIsBelowDefinition)
                results.push(lines[i]);

            lastBlockEndLine = block.endLine;
        }

        // print tail after last comment block
        for(var i = lastBlockEndLine; i < lines.length; i++) {
            results.push(lines[i]);
        }
    }

    return results.join('\n');
}