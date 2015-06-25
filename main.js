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
var settings = require('./settings');
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

console.log("PLUGINS: ",plugins)

var
    parseFwdMsg_arr = [],
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

    if (typeof(plugin.parseFwdMsg) == "function")
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

    var webhookHash = utils.generateHash();

    app.post('/' + webhookHash, function(req, res)
    {
        debug.info("Got a message from Telegram!".green)
        onUpdate(req.body);
        res.end(JSON.stringify(
        {
            "success": true
        }));
    });

    debug.info("webHook: " + webhookHash)
    var url = "https://"+ settings.hostname +"/" + webhookHash
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
            parseAudioMsg(message.audio);
            break;

        case hop("document"):
            parseDocumentMsg(message.document);
            break;

        case hop("photo"):
            parsePhotoMsg(message.photo);
            break;

        case hop("sticker"):
            parseStickerMsg(message);
            break;

        case hop("video"):
            parseVideoMsg(message.video);
            break;

        case hop("contact"):
            parseContactMsg(message.contact);
            break;

        case hop("location"):
            parseLocationMsg(message.location);
            break;

        case hop("new_chat_participant"):
            parseNewChatParticipantMsg(message.new_chat_participant);
            break;

        case hop("left_chat_participant"):
            parseLeftParticipant(message.left_chat_participant);
            break;

        case hop("new_chat_title"):
            parseNewChatTitle(message.new_chat_title);
            break;

        case hop("new_chat_photo"):
            parseNewChatPhoto(message.new_chat_photo);
            break;

        case hop("delete_chat_photo"):
            parseDeleteChatPhoto(message.delete_chat_photo);
            break;

        case hop("group_chat_created"):
            parseGroupChatCreated(message.group_chat_created);
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

function parseDocumentMsg(document)
{
    for (i in parseDocumentMsg_arr)
    {
        parseDocumentMsg_arr[i].parseDocumentMsg(document);
    }
}

function parsePhotoMsg(photo)
{
    for (i in parsePhotoMsg_arr)
    {
        parsePhotoMsg_arr[i].parsePhotoMsg(photo);
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

function parseVideoMsg(video)
{
    for (i in parseVideoMsg_arr)
    {
        parseVideoMsg_arr[i].parseVideoMsg(video);
    }
}

function parseContactMsg(contact)
{
    for (i in parseContactMsg_arr)
    {
        parseContactMsg_arr[i].parseContactMsg(contact);
    }
}

function parseLocationMsg(location)
{
    for (i in parseLocationMsg_arr)
    {
        parseLocationMsg_arr[i].parseLocationMsg(location);
    }
}

function parseNewChatParticipantMsg(user)
{
    for (i in parseNewChatParticipantMsg_arr)
    {
        parseNewChatParticipantMsg_arr[i].parseNewChatParticipantMsg(user);
    }
}

function parseLeftParticipant(user)
{
    for (i in parseLeftParticipant_arr)
    {
        parseLeftParticipant_arr[i].parseLeftParticipant(user);
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

function parseGroupChatCreated(bool)
{
    for (i in parseFwdMsg_arr)
    {
        parseGroupChatCreated_arr[i].parseGroupChatCreated(bool);
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

    debug.info(("[" + from.first_name + " " + from.last_name + "]")
        .yellow + " => " + message.text);

    switch (message.text)
    {
        case "/status":
            methods.sendMessage(chat_id, me.name + " is online and rocking!", null, message.message_id, null)
            break;
    }
}