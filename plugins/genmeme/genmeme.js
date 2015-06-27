var methods = require("../../methods");
var debug = require("../../debug");

//Module dependencies
var fs = require('fs');
var Promise = require("bluebird");
var request = require("request");
var promRequest = Promise.promisify(request);
var easyimg = require('easyimage');
var gm = require('gm');



var genmeme = {};

genmeme.parseTextMsg = function(message)
{
    var regexp = new RegExp("^\/genmeme(?:@"+genmeme._globals.me.username+"|) (.*)-(.*?)-(.*?)$");
    var matches = message.text.match(regexp);
    if (matches)
    {
        genmeme.searchImage(matches[1])
            .then(function(imageUrl)
            {
                request(imageUrl)
                    .pipe(fs.createWriteStream(__dirname + "/tmp/google_image_meme.jpg"))
                    .on("finish", function()
                    {
                        console.log("Okay!", imageUrl);
                        var image = gm(__dirname + "/tmp/google_image_meme.jpg");
                        image.size(function(err, value)
                        {

                            var textlength = [matches[2].length, matches[3].length];

                            if (err)
                            {
                                console.log(err);
                                methods.sendMessage(message.chat.id, "There was an error with the image, please retry!", null, message.message_id);
                                return;
                            }

                            console.log(value);

                            if (value.width > value.height || value.width == value.height)
                            {
                                //HEIGHT BASED
                                var size = 130;
                                var ratio = 15;
                                var stroke_ratio = 9 / 2000;
                                var bottomspace_ratio = 10 / 1339
                                var ratio_text = 45;
                                var diff = 5;

                                var fontSize1 = 60 * (textlength[0] < 5 ? 3 : (ratio_text / (textlength[0] + diff) > ratio_text ? ratio_text : ratio_text / (textlength[0] + diff))) / 1339 * value.height;
                                var fontSize2 = 60 * (textlength[0] < 5 ? 3 : (ratio_text / (textlength[1] + diff) > ratio_text ? ratio_text : ratio_text / (textlength[1] + diff))) / 1339 * value.height;

                                image.font(__dirname + "/fonts/impact.ttf")
                                    .fill("#FFFFFF")
                                    .stroke("#000000", stroke_ratio * value.height)
                                    .fontSize(fontSize1)
                                    .drawText(0, fontSize1, matches[2].toUpperCase(), "North")
                                    .fontSize(fontSize2)
                                    .drawText(0, value.height - bottomspace_ratio * value.height, matches[3].toUpperCase(), "North")
                                    .write(__dirname + "/tmp/meme.jpg", function(err)
                                    {
                                        console.log("Image written");
                                        console.log(err);
                                        if (!err)
                                        {
                                            var photo = {
                                                value: fs.readFileSync(__dirname + "/tmp/meme.jpg"),
                                                options:
                                                {
                                                    filename: "meme.jpg",
                                                    contentType: 'image/jpg'
                                                }
                                            }
                                            methods.sendPhoto(message.chat.id, photo, "", message.message_id);
                                        }
                                    });
                            }
                            else
                            {
                                //WIDTH BASED
                                var size = 130;
                                var ratio = 15;
                                var stroke_ratio = 5 / 1999;
                                var bottomspace_ratio = 10 / 2000
                                var ratio_text = 45;
                                var diff = 5;

                                var fontSize1 = 100 * (textlength[0] < 5 ? 3 : (ratio_text / (textlength[0] + diff) > ratio_text ? ratio_text : ratio_text / (textlength[0] + diff))) / 2000 * value.width;
                                var fontSize2 = 100 * (textlength[0] < 5 ? 3 : (ratio_text / (textlength[1] + diff) > ratio_text ? ratio_text : ratio_text / (textlength[1] + diff))) / 2000 * value.width;

                                image.font(__dirname + "/fonts/impact.ttf")
                                    .fill("#FFFFFF")
                                    .stroke("#000000", stroke_ratio * value.width)
                                    .fontSize(fontSize1)
                                    .drawText(0, fontSize1, matches[2].toUpperCase(), "North")
                                    .fontSize(fontSize2)
                                    .drawText(0, value.height - bottomspace_ratio * value.height, matches[3].toUpperCase(), "North")
                                    .write(__dirname + "/tmp/meme.jpg", function(err)
                                    {
                                        console.log("Image written");
                                        console.log(err);
                                        if (!err)
                                        {
                                            var photo = {
                                                value: fs.readFileSync(__dirname + "/tmp/meme.jpg"),
                                                options:
                                                {
                                                    filename: "meme.jpg",
                                                    contentType: 'image/jpg'
                                                }
                                            }
                                            methods.sendPhoto(message.chat.id, photo, "", message.message_id);
                                        }
                                    });
                            }
                        })
                    })
            });


    }
}

genmeme._globals = {};
genmeme.setGlobals = function(globals)
{
    this._globals = globals;
}


genmeme.searchImage = function(term)
{
    //Based on https://github.com/vdemedes/node-google-images/  var fs, generateInfo, request;

    return promRequest("http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + encodeURIComponent(term) + "&start=0")
        .then(function(contents)
        {
            var images, item, items, _i, _len;
            items = JSON.parse(contents[1])
                .responseData.results;

            //Get a random image
            var item = items[Math.floor(Math.random() * (items.length))];
            return item.url;
        });
}

genmeme.properties = {
    name: "Meme generator",
    friendlyName: "genmeme",
    description: "This plugin creates a meme based on a web image search and a text for top/bottom",
    usage: "Type /genmeme <image search keyword>-<text on top>-<text on bottom> to generate a meme",
    version: "1.0.0"
}

module.exports = genmeme;