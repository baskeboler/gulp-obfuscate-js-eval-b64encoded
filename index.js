var gutil = require('gulp-util');
var through = require('through2');
var btoa = require('btoa');

var PluginError = gutil.PluginError;

const PLUGIN_NAME='gulp-obfuscate-js-eval-b64encoded';

function processor() {

    var stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported'));
            return cb();
        }

        if (file.isBuffer()) {
            var base64Text = btoa(file.contents.toString());

            file.contents = Buffer.concat([
                new Buffer('eval(atob(\''),
                new Buffer(base64Text),
                new Buffer('\'));')
            ]);
        }

        this.push(file);

        cb();
    });

    return stream;

}

module.exports = processor;