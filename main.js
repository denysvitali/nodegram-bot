var Promise = require("bluebird");
var colors = require('colors');
var request = Promise.promisify(require("request"));
var bodyParser = require('body-parser')


// Express on HTTP
var fs = require('fs'),
    read = fs.readFileSync,
    express = require('express'),
    app = express();

// LFI
var settings = JSON.parse(fs.readFileSync(__dirname + "/settings.json"));
var debug = require('./debug');
var utils = require('./utils');
var methods = require('./methods');


// Objects

var Me = require('./models/Me');

var me = new Me();
me.getInfos()
    .then(function()
    {
        init();
    });


// LOAD PLUGINS

var plugins = [];

var pluginPath = __dirname + "/plugins";
var result = fs.readdirSync(pluginPath);

for (i in result)
{
    var stat = fs.statSync(pluginPath + "/" + result[i]);
    if (!stat.isDirectory() && result[i].match(/^.+\.js$/i))
    {
        debug.info("Plugin found: " + result[i]);
        var plugin = require(pluginPath + "/" + result[i]);
        plugins.push(plugin);
    }
}

console.log("PLUGINS: ", plugins)

var
    parseFwdMsg_arr = [],
    parseAudioMsg_arr = [],
    parseDocumentMsg_arr = [],
    parsePhotoMsg_arr = [],
    parseStickerMsg_arr = [],
    parseVideoMsg_arr = [],
    parseContactMsg_arr = [],
    parseLocationMsg_arr = [],
    parseNewChatParticipantMsg_arr = [],
    parseLeftParticipant_arr = [],
    parseNewChatTitle_arr = [],
    parseNewChatPhoto_arr = [],
    parseDeleteChatPhoto_arr = [],
    parseGroupChatCreated_arr = [],
    parseTextMsg_arr = [];

for (i in plugins)
{
    var plugin = plugins[i];
    if (typeof(plugin.parseFwdMsg) == "function")
        parseFwdMsg_arr.push(plugin);

    if (typeof(plugin.parseAudioMsg) == "function")
        parseAudioMsg_arr.push(plugin);

    if (typeof(plugin.parseDocumentMsg) == "function")
        parseDocumentMsg_arr.push(plugin);

    if (typeof(plugin.parsePhotoMsg) == "function")
        parsePhotoMsg_arr.push(plugin);

    if (typeof(plugin.parseStickerMsg) == "function")
        parseStickerMsg_arr.push(plugin);

    if (typeof(plugin.parseVideoMsg) == "function")
        parseVideoMsg_arr.push(plugin);

    if (typeof(plugin.parseContactMsg) == "function")
        parseContactMsg_arr.push(plugin);

    if (typeof(plugin.parseLocationMsg) == "function")
        parseLocationMsg_arr.push(plugin);

    if (typeof(plugin.parseNewChatParticipantMsg) == "function")
        parseNewChatParticipantMsg_arr.push(plugin);

    if (typeof(plugin.parseLeftParticipant) == "function")
        parseLeftParticipant_arr.push(plugin);

    if (typeof(plugin.parseNewChatTitle) == "function")
        parseNewChatTitle_arr.push(plugin);

    if (typeof(plugin.parseNewChatPhoto) == "function")
        parseNewChatPhoto_arr.push(plugin);

    if (typeof(plugin.parseDeleteChatPhoto) == "function")
        parseDeleteChatPhoto_arr.push(plugin);

    if (typeof(plugin.parseGroupChatCreated) == "function")
        parseGroupChatCreated_arr.push(plugin);

    if (typeof(plugin.parseTextMsg) == "function")
        parseTextMsg_arr.push(plugin);

}

function updateSettings()
{
    fs.writeFileSync(__dirname + "/settings.json", JSON.stringify(settings));
}


function init()
{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded(
    {
        extended: true
    }));

    debug.info("Bot name: " + me.name)
    app.get('/', function(req, res)
    {
        res.send('<h1>Tg-bot</h1>');
    });


    if (typeof(settings.webHook) != "string")
    {
        settings.webHook = utils.generateHash();
    }

    updateSettings();

    app.post('/' + settings.webHook, function(req, res)
    {
        debug.info("Got a message from Telegram!".green)
        onUpdate(req.body);
        res.end(JSON.stringify(
        {
            "success": true
        }));
    });

    debug.info("webHook: " + settings.webHook)
    var url = "https://" + settings.hostname + "/" + settings.webHook
    debug.info(url);
    request(
    {
        url: settings.api + "/bot" + settings.token + "/setWebhook",
        method: "GET",
        formData:
        {
            url: url
        }
    })
        .then(function(contents)
        {
            console.log(contents[1]);
        });

    app.listen(settings.port)
}

function onUpdate(update)
{
    // Router
    var hop = function(prop)
    {
        return update.hasOwnProperty(prop)
    };

    switch (true)
    {
        case hop("message"):
            parseMsg(update.message);
            break;
    }
}

function parseMsg(message)
{
    // Router
    var hop = function(prop)
    {
        return message.hasOwnProperty(prop)
    };

    switch (true)
    {
        case hop("forward_from"):
            parseFwdMsg(message);
            break;

        case hop("audio"):
            parseAudioMsg(message);
            break;

        case hop("document"):
            parseDocumentMsg(message);
            break;

        case hop("photo"):
            parsePhotoMsg(message);
            break;

        case hop("sticker"):
            parseStickerMsg(message);
            break;

        case hop("video"):
            parseVideoMsg(message);
            break;

        case hop("contact"):
            parseContactMsg(message);
            break;

        case hop("location"):
            parseLocationMsg(message);
            break;

        case hop("new_chat_participant"):
            parseNewChatParticipantMsg(message);
            break;

        case hop("left_chat_participant"):
            parseLeftParticipant(message);
            break;

        case hop("new_chat_title"):
            parseNewChatTitle(message);
            break;

        case hop("new_chat_photo"):
            parseNewChatPhoto(message);
            break;

        case hop("delete_chat_photo"):
            parseDeleteChatPhoto(message.delete_chat_photo);
            break;

        case hop("group_chat_created"):
            parseGroupChatCreated(message);
            break;

        case hop("text"):
            parseTextMsg(message);
            break;
    }

}

function parseFwdMsg(message)
{
    for (i in parseFwdMsg_arr)
    {
        parseFwdMsg_arr[i].parseFwdMsg(message);
    }
}

function parseAudioMsg(message)
{
    var from = message.from;
    debug.info(("[" + from.first_name + (from.last_name != null ? " " + from.last_name : "") + "]")
        .yellow + " sent an audio message");
    debug.info(message.audio);
    for (i in parseAudioMsg_arr)
    {
        parseAudioMsg_arr[i].parseAudioMsg(message);
    }
}

function parseDocumentMsg(message)
{
    for (i in parseDocumentMsg_arr)
    {
        parseDocumentMsg_arr[i].parseDocumentMsg(message);
    }
}

function parsePhotoMsg(message)
{
    for (i in parsePhotoMsg_arr)
    {
        parsePhotoMsg_arr[i].parsePhotoMsg(message);
    }
}

function parseStickerMsg(message)
{
    console.log("parseStickerMsg");
    for (i in parseStickerMsg_arr)
    {
        parseStickerMsg_arr[i].parseStickerMsg(message);
    }
    console.log(parseStickerMsg_arr, parseStickerMsg_arr.length);
}

function parseVideoMsg(message)
{
    for (i in parseVideoMsg_arr)
    {
        parseVideoMsg_arr[i].parseVideoMsg(message);
    }
}

function parseContactMsg(message)
{
    for (i in parseContactMsg_arr)
    {
        parseContactMsg_arr[i].parseContactMsg(message);
    }
}

function parseLocationMsg(message)
{
    for (i in parseLocationMsg_arr)
    {
        parseLocationMsg_arr[i].parseLocationMsg(message);
    }
}

function parseNewChatParticipantMsg(message)
{
    for (i in parseNewChatParticipantMsg_arr)
    {
        parseNewChatParticipantMsg_arr[i].parseNewChatParticipantMsg(message);
    }
}

function parseLeftParticipant(message)
{
    for (i in parseLeftParticipant_arr)
    {
        parseLeftParticipant_arr[i].parseLeftParticipant(message);
    }
}

function parseNewChatTitle(title)
{
    for (i in parseNewChatTitle_arr)
    {
        parseNewChatTitle_arr[i].parseNewChatTitle(title);
    }
}

function parseNewChatPhoto(photo_string)
{
    for (i in parseNewChatPhoto_arr)
    {
        parseNewChatPhoto_arr[i].parseNewChatPhoto(photo_string);
    }
}

function parseDeleteChatPhoto(bool)
{
    for (i in parseDeleteChatPhoto_arr)
    {
        parseDeleteChatPhoto_arr[i].parseDeleteChatPhoto(bool);
    }
    // true
}

function parseGroupChatCreated(message)
{
    for (i in parseFwdMsg_arr)
    {
        parseGroupChatCreated_arr[i].parseGroupChatCreated(message);
    }
    // true
}

function parseTextMsg(message)
{

    for (i in parseTextMsg_arr)
    {
        parseTextMsg_arr[i].parseTextMsg(message);
    }

    var from = message.from;
    var chat_id = message.chat.id

    debug.info(("[" + from.first_name + (from.last_name != null ? " " + from.last_name : "") + "]")
        .yellow + " => " + message.text);

    switch (message.text)
    {
        case "/status":
            methods.sendMessage(chat_id, me.name + " is online and rocking!", null, message.message_id, null)
            break;
    }
}