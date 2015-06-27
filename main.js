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

// Bot versioning settings
var plugins_global = {
    "nodegramV": "1.0.4",
    "githubUrl": "https://github.com/denysvitali/nodegram-bot",
    "me": me
};

var plugin_manager = require("./plugins/plugin_manager/plugin_manager");
plugin_manager.init(plugins_global);
plugin_manager.reloadPlugins();

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
            plugin_manager.parseFwdMsg(message);
            break;

        case hop("audio"):
            plugin_manager.parseAudioMsg(message);
            break;

        case hop("document"):
            plugin_manager.parseDocumentMsg(message);
            break;

        case hop("photo"):
            plugin_manager.parsePhotoMsg(message);
            break;

        case hop("sticker"):
            plugin_manager.parseStickerMsg(message);
            break;

        case hop("video"):
            plugin_manager.parseVideoMsg(message);
            break;

        case hop("contact"):
            plugin_manager.parseContactMsg(message);
            break;

        case hop("location"):
            plugin_manager.parseLocationMsg(message);
            break;

        case hop("new_chat_participant"):
            plugin_manager.parseNewChatParticipantMsg(message);
            break;

        case hop("left_chat_participant"):
            plugin_manager.parseLeftParticipant(message);
            break;

        case hop("new_chat_title"):
            plugin_manager.parseNewChatTitle(message);
            break;

        case hop("new_chat_photo"):
            plugin_manager.parseNewChatPhoto(message);
            break;

        case hop("delete_chat_photo"):
            plugin_manager.parseDeleteChatPhoto(message.delete_chat_photo);
            break;

        case hop("group_chat_created"):
            plugin_manager.parseGroupChatCreated(message);
            break;

        case hop("text"):
            plugin_manager.parseTextMsg(message);
            break;
    }

}