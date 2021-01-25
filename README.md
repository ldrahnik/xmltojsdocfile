# xmltojsdocfile

# Usage

Allowed input for `--inputpath` is file, directory. Allowed input for `--outputpath` is file, directory. When is `--outputpath` no specified, is used standard output.
 ```
 Grunt --inputpath=./test/input/subdir/file.js                                      # file to stdout
 Grunt --inputpath=./test/input/subdir/file.js > ./test/output/file.js              # file to file
 Grunt --inputpath=./test/input/subdir/file.js --outputpath=./test/output/file.js   # file to file
 Grunt --inputpath=./test/input/subdir/file.js --outputpath=./test/output/          # file to dir
 Grunt --inputpath=./test/input/                                                    # dir to stdout
 Grunt --inputpath=./test/input/ > ./test/output/file.js                            # dir to file
 Grunt --inputpath=./test/input/ --outputpath=./test/output/file.js                 # dir to file
 Grunt --inputpath=./test/input/ --outputpath=./test/output/                        # dir to dir
 ```
