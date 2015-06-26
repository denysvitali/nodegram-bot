var fs = require('fs');
var settings = JSON.parse(fs.readFileSync(__dirname + "/settings.json"));
var debug = {};

debug.start_time = Date.now();
debug.info = function(text)
{
    if (settings.debug)
    {
        var now = Date.now() - this.start_time;
        console.log(("[" + now + "] " + text)
            .blue);
    }
};

debug.warn = function(text)
{
    if (settings.debug)
    {
        var now = Date.now() - this.start_time;
        console.log(("[" + now + "] " + text)
            .yellow);
    }
};

debug.err = function(text)
{
    var now = Date.now() - this.start_time;
    console.log(("[" + now + "] " + text)
        .bgRed);
    throw text;
};
module.exports = debug;