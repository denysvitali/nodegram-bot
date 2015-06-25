var Promise = require("bluebird");
var request = Promise.promisify(require("request"));

var settings = require("./settings");
var debug = require("./debug");


var methods = {};

methods.sendMessage = function(chatid, message, dwp, reply_to_mid, reply_markup)
{
    var formData = {
        chat_id: chatid,
        text: message,
        disable_web_page_preview: dwp,
        reply_to_message_id: reply_to_mid,
        reply_markup: reply_markup
    };

    var keys = Object.keys(formData);
    for (i in keys)
    {
        if (formData[keys[i]] == null)
        {
            delete formData[keys[i]]
        }
    }

    return request(
        {
            url: settings.api + "/bot" + settings.token + "/sendMessage",
            method: "POST",
            formData: formData
        })
        .catch(function(e)
        {
            debug.err(e);
        })
}

methods.sendSticker = function(chatid, sticker, reply_to_mid, reply_mup)
{
    if (typeof(reply_to_mid) == "undefined")
        reply_to_mid = null
    if (typeof(reply_mup) == "undefined")
        reply_mup = null

    var formData = {
        chat_id: chatid,
        sticker: sticker,
        reply_to_message_id: reply_to_mid,
        reply_markup: reply_mup
    };

    var keys = Object.keys(formData);
    for (i in keys)
    {
        if (formData[keys[i]] == null)
        {
            delete formData[keys[i]]
        }
    }

    return request(
        {
            url: settings.api + "/bot" + settings.token + "/sendSticker",
            method: "POST",
            formData: formData
        })
        .catch(function(e)
        {
            debug.err(e);
        })
}

module.exports = methods;