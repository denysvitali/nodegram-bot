var methods = require("../../methods");
var debug = require("../../debug");

//Module dependencies
var fs = require('fs');
var webshot = require('webshot');
var easyimg = require('easyimage');



var trend = {};

trend.parseTextMsg = function(message)
{
    var regexp = new RegExp("^\/trend(?:@"+trend._globals.me.username+"|) (.*?),(.*)$");
    var matches = message.text.match(regexp);
    if (matches)
    {
        //command okay
        var other_trends = matches[2].split(",");
        var trends_unescaped = matches[1] + "," + matches[2];
        var first_trend = encodeURIComponent(matches[1]);

        for (i in other_trends)
        {
            other_trends[i] = encodeURIComponent(other_trends[i]);
        }
        var trends = first_trend + "," + other_trends.join(",");

        webshot('http://www.google.com/trends/fetchComponent?hl=en-US&q=' + trends + '&cid=TIMESERIES_GRAPH_0&export=5&w=1024&h=900', 'googletrend.png', function(err)
        {
            if (err)
            {
                methods.sendMessage(message.chat.id, "Unable to get trends at the moment", message.message_id)
            }
            else
            {
                easyimg.crop(
                {
                    src: "googletrend.png",
                    dst: "googletrend.png",
                    x: 0,
                    y: 0,
                    gravity: "North",
                    cropwidth: 1024,
                    cropheight: 400
                })
                    .then(function()
                    {
                        var photo = {
                            value: fs.createReadStream('googletrend.png'),
                            options:
                            {
                                filename: 'googletrend.jpg',
                                contentType: 'image/jpg'
                            }
                        }
                        methods.sendPhoto(message.chat.id, photo, "Trend of " + trends_unescaped, message.message_id);
                    });
            }
        });

    }
}

trend._globals = {};
trend.setGlobals = function(globals)
{
    this._globals = globals;
}

trend.usage = function()
{
    var msg = "";
    msg += "This plugin makes a comparison between two or more trends by using webshot and the Google Trends webpage\n"
    msg += "Type /trend <trend1>,<trend2>[,<trend3>,<trendN>] to view some trends!"
    return msg;
}

trend.properties = {
    name: "Trend",
    friendlyName: "trend",
    description: "This plugin makes a comparison between two or more trends by using webshot and the Google Trends webpage",
    usage: "Type /trend <trend1>,<trend2>[,<trend3>,<trendN>] to view some trends",
    version: "1.0.0"
}

module.exports = trend;