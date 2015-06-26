var methods = require("../../methods");
var debug = require("../../debug");

//Module dependencies
var fs = require('fs');
var Promise = require("bluebird");
var request = require("request");
var promRequest = Promise.promisify(request);



var getimg = {};

getimg.parseTextMsg = function(message)
{
    var matches = message.text.match(/\/getimg (.*)$/);
    if (matches)
    {
        getimg.searchImage(matches[1])
            .then(function(imageUrl)
            {
                request(imageUrl)
                    .pipe(fs.createWriteStream(__dirname + "/tmp/google_image.jpg"))
                    .on("finish", function()
                    {

                        var photo = {
                            value: fs.readFileSync(__dirname + "/tmp/google_image.jpg"),
                            options:
                            {
                                filename: "meme.jpg",
                                contentType: 'image/jpg'
                            }
                        }
                        methods.sendPhoto(message.chat.id, photo, "", message.message_id);
                    })
            }).catch(function(error)
            {
                
            });


    }
}


getimg.searchImage = function(term)
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

getimg.usage = function()
{
    var msg = "";
    msg += "This plugin creates returns a photo from the provided keywords by using Google Search"
    msg += "Type /getimg <image search keyword> to get an image"
    return msg;
}

module.exports = getimg;