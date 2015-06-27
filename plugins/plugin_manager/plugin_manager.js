var methods = require("../../methods");
var debug = require("../../debug");
var methods = require("../../methods");

var fs = require("fs");
var emoji = require('node-emoji');

var plugin_manager = {};

/**************     ARRAYS   *************************/

plugin_manager.parseFwdMsg_arr = [],
plugin_manager.parseAudioMsg_arr = [],
plugin_manager.parseDocumentMsg_arr = [],
plugin_manager.parsePhotoMsg_arr = [],
plugin_manager.parseStickerMsg_arr = [],
plugin_manager.parseVideoMsg_arr = [],
plugin_manager.parseContactMsg_arr = [],
plugin_manager.parseLocationMsg_arr = [],
plugin_manager.parseNewChatParticipantMsg_arr = [],
plugin_manager.parseLeftParticipant_arr = [],
plugin_manager.parseNewChatTitle_arr = [],
plugin_manager.parseNewChatPhoto_arr = [],
plugin_manager.parseDeleteChatPhoto_arr = [],
plugin_manager.parseGroupChatCreated_arr = [],
plugin_manager.parseTextMsg_arr = [];

/******************************************************/


plugin_manager.init = function(plugins_global)
{
    this._plugins_global = plugins_global;
}

plugin_manager.plugins_list = [];
plugin_manager.plugins = [];

plugin_manager.reloadPlugins = function()
{
    plugin_manager.plugins_list = [];
    plugin_manager.plugins = [];

    var plugins = [];
    var pluginPath = __dirname + "/../";
    var result = fs.readdirSync(pluginPath);

    for (i in result)
    {
        var stat = fs.statSync(pluginPath + "/" + result[i]);
        if (stat.isDirectory())
        {
            var dirname = result[i];
            var dir = fs.readdirSync(pluginPath + "/" + result[i]);
            for (i2 in dir)
            {
                var fileStat = fs.statSync(pluginPath + "/" + result[i] + "/" + dir[i2]);
                if (!fileStat.isDirectory() && dir[i2] == (result[i] + ".js")
                    .toLowerCase())
                {
                    var plugin = require(pluginPath + "/" + result[i] + "/" + dir[i2]);
                    if (typeof(plugin.setGlobals) == "function")
                    {
                        plugin.setGlobals(plugin_manager._plugins_global);
                    }

                    if (typeof(plugin.setPMPlugins) == "function")
                    {
                        plugin.setPMPlugins(plugin_manager.plugins);
                    }

                    if (plugin.hasOwnProperty("properties"))
                    {
                        if (plugin.properties.hasOwnProperty("friendlyName"))
                        {
                            plugin_manager.plugins.push(plugin);
                            plugin_manager.plugins_list.push(plugin.properties.friendlyName);
                            debug.info("Plugin found: " + result[i]);
                        }
                    }
                }
            }
        }
    }

    fs.writeFileSync(__dirname + "/../../data/plugins_list.json", JSON.stringify(plugin_manager.plugins_list));
    try
    {
        var plugins_enabled = JSON.parse(fs.readFileSync(__dirname + "/../../data/plugins_enabled.json"));
    }
    catch (e)
    {
        debug.err(e);
    }

    plugin_manager.parseFwdMsg_arr = [],
    plugin_manager.parseAudioMsg_arr = [],
    plugin_manager.parseDocumentMsg_arr = [],
    plugin_manager.parsePhotoMsg_arr = [],
    plugin_manager.parseStickerMsg_arr = [],
    plugin_manager.parseVideoMsg_arr = [],
    plugin_manager.parseContactMsg_arr = [],
    plugin_manager.parseLocationMsg_arr = [],
    plugin_manager.parseNewChatParticipantMsg_arr = [],
    plugin_manager.parseLeftParticipant_arr = [],
    plugin_manager.parseNewChatTitle_arr = [],
    plugin_manager.parseNewChatPhoto_arr = [],
    plugin_manager.parseDeleteChatPhoto_arr = [],
    plugin_manager.parseGroupChatCreated_arr = [],
    plugin_manager.parseTextMsg_arr = [];

    for (i in plugin_manager.plugins)
    {
        var plugin = plugin_manager.plugins[i];
        if (plugins_enabled.indexOf(plugin.properties.friendlyName) == -1)
        {
            continue;
        }

        debug.info("Plugin " + plugin.properties.friendlyName + " is enabled");

        if (typeof(plugin.parseFwdMsg) == "function")
            plugin_manager.parseFwdMsg_arr.push(plugin);

        if (typeof(plugin.parseAudioMsg) == "function")
            plugin_manager.parseAudioMsg_arr.push(plugin);

        if (typeof(plugin.parseDocumentMsg) == "function")
            plugin_manager.parseDocumentMsg_arr.push(plugin);

        if (typeof(plugin.parsePhotoMsg) == "function")
            plugin_manager.parsePhotoMsg_arr.push(plugin);

        if (typeof(plugin.parseStickerMsg) == "function")
            plugin_manager.parseStickerMsg_arr.push(plugin);

        if (typeof(plugin.parseVideoMsg) == "function")
            plugin_manager.parseVideoMsg_arr.push(plugin);

        if (typeof(plugin.parseContactMsg) == "function")
            plugin_manager.parseContactMsg_arr.push(plugin);

        if (typeof(plugin.parseLocationMsg) == "function")
            plugin_manager.parseLocationMsg_arr.push(plugin);

        if (typeof(plugin.parseNewChatParticipantMsg) == "function")
            plugin_manager.parseNewChatParticipantMsg_arr.push(plugin);

        if (typeof(plugin.parseLeftParticipant) == "function")
            plugin_manager.parseLeftParticipant_arr.push(plugin);

        if (typeof(plugin.parseNewChatTitle) == "function")
            plugin_manager.parseNewChatTitle_arr.push(plugin);

        if (typeof(plugin.parseNewChatPhoto) == "function")
            plugin_manager.parseNewChatPhoto_arr.push(plugin);

        if (typeof(plugin.parseDeleteChatPhoto) == "function")
            plugin_manager.parseDeleteChatPhoto_arr.push(plugin);

        if (typeof(plugin.parseGroupChatCreated) == "function")
            plugin_manager.parseGroupChatCreated_arr.push(plugin);

        if (typeof(plugin.parseTextMsg) == "function")
            plugin_manager.parseTextMsg_arr.push(plugin);

    }
}

plugin_manager.parseFwdMsg = function(message)
{
    for (i in plugin_manager.parseFwdMsg_arr)
    {
        plugin_manager.parseFwdMsg_arr[i].parseFwdMsg(message);
    }
}

plugin_manager.parseAudioMsg = function(message)
{
    var from = message.from;
    debug.info(("[" + from.first_name + (from.last_name != null ? " " + from.last_name : "") + "]")
        .yellow + " sent an audio message");
    debug.info(message.audio);
    for (i in plugin_manager.parseAudioMsg_arr)
    {
        plugin_manager.parseAudioMsg_arr[i].parseAudioMsg(message);
    }
}

plugin_manager.parseDocumentMsg = function(message)
{
    for (i in plugin_manager.parseDocumentMsg_arr)
    {
        plugin_manager.parseDocumentMsg_arr[i].parseDocumentMsg(message);
    }
}

plugin_manager.parsePhotoMsg = function(message)
{
    for (i in plugin_manager.parsePhotoMsg_arr)
    {
        plugin_manager.parsePhotoMsg_arr[i].parsePhotoMsg(message);
    }
}

plugin_manager.parseStickerMsg = function(message)
{
    console.log("parseStickerMsg");
    for (i in plugin_manager.parseStickerMsg_arr)
    {
        plugin_manager.parseStickerMsg_arr[i].parseStickerMsg(message);
    }
}

plugin_manager.parseVideoMsg = function(message)
{
    for (i in plugin_manager.parseVideoMsg_arr)
    {
        plugin_manager.parseVideoMsg_arr[i].parseVideoMsg(message);
    }
}

plugin_manager.parseContactMsg = function(message)
{
    for (i in plugin_manager.parseContactMsg_arr)
    {
        plugin_manager.parseContactMsg_arr[i].parseContactMsg(message);
    }
}

plugin_manager.parseLocationMsg = function(message)
{
    for (i in plugin_manager.parseLocationMsg_arr)
    {
        plugin_manager.parseLocationMsg_arr[i].parseLocationMsg(message);
    }
}

plugin_manager.parseNewChatParticipantMsg = function(message)
{
    for (i in plugin_manager.parseNewChatParticipantMsg_arr)
    {
        plugin_manager.parseNewChatParticipantMsg_arr[i].parseNewChatParticipantMsg(message);
    }
}

plugin_manager.parseLeftParticipant = function(message)
{
    for (i in plugin_manager.parseLeftParticipant_arr)
    {
        plugin_manager.parseLeftParticipant_arr[i].parseLeftParticipant(message);
    }
}

plugin_manager.parseNewChatTitle = function(title)
{
    for (i in plugin_manager.parseNewChatTitle_arr)
    {
        plugin_manager.parseNewChatTitle_arr[i].parseNewChatTitle(title);
    }
}

plugin_manager.parseNewChatPhoto = function(photo_string)
{
    for (i in plugin_manager.parseNewChatPhoto_arr)
    {
        plugin_manager.parseNewChatPhoto_arr[i].parseNewChatPhoto(photo_string);
    }
}

plugin_manager.parseDeleteChatPhoto = function(bool)
{
    for (i in plugin_manager.parseDeleteChatPhoto_arr)
    {
        plugin_manager.parseDeleteChatPhoto_arr[i].parseDeleteChatPhoto(bool);
    }
    // true
}

plugin_manager.parseGroupChatCreated = function(message)
{
    for (i in plugin_manager.parseFwdMsg_arr)
    {
        plugin_manager.parseGroupChatCreated_arr[i].parseGroupChatCreated(message);
    }
}

plugin_manager.parseTextMsg = function(message)
{

    for (i in plugin_manager.parseTextMsg_arr)
    {
        plugin_manager.parseTextMsg_arr[i].parseTextMsg(message);
    }

    var from = message.from;
    var chat_id = message.chat.id

    debug.info(("[" + from.first_name + (from.last_name != null ? " " + from.last_name : "") + "]")
        .yellow + " => " + message.text);


    if (message.text == "/getmyid" || message.text == "/getmyid@"+plugin_manager._plugins_global.me.username)
    {
        methods.sendMessage(message.chat.id, "Your id is: " + from.id, null, message.message_id);
        return;
    }

    var regexp = new RegExp("^\/plugin(?:@"+plugin_manager._plugins_global.me.username+"|) (?:(enable|disable) (.*?)|(list))$");
    var matches = message.text.match(regexp);
    if (matches)
    {
        //Invoked plugin enable/disable
        var settings = JSON.parse(fs.readFileSync(__dirname + "/../../settings.json"));
        if (settings.superusers.indexOf(message.from.id.toString()) == -1)
        {
            methods.sendMessage(message.chat.id, "You must be a superuser to perform this action", null, message.message_id);
        }
        else
        {
            try
            {
                var pluginsEnabled = JSON.parse(fs.readFileSync(__dirname + "/../../data/plugins_enabled.json"));
                if (matches[1] == "enable")
                {
                    if (pluginsEnabled.indexOf(matches[2]) != -1)
                    {
                        methods.sendMessage(message.chat.id, "Plugin \"" + matches[2] + "\" is already enabled", null, message.message_id);
                        return;
                    }
                    if (plugin_manager.plugins_list.indexOf(matches[2]) != -1)
                    {
                        pluginsEnabled.push(matches[2]);
                        fs.writeFileSync(__dirname + "/../../data/plugins_enabled.json", JSON.stringify(pluginsEnabled));
                        methods.sendMessage(message.chat.id, "Plugin \"" + matches[2] + "\" enabled!", null, message.message_id);
                        plugin_manager.reloadPlugins();
                        return;
                    }
                    else
                    {
                        methods.sendMessage(message.chat.id, "The plugin \"" + matches[2] + "\" doesn't exists", null, message.message_id);
                        return;
                    }
                }
                else if (matches[1] == "disable")
                {
                    //disable
                    if (pluginsEnabled.indexOf(matches[2]) == -1)
                    {
                        methods.sendMessage(message.chat.id, "Plugin \"" + matches[2] + "\" already disabled", null, message.message_id);
                        return;
                    }

                    delete pluginsEnabled[pluginsEnabled.indexOf(matches[2])];
                    fs.writeFileSync(__dirname + "/../../data/plugins_enabled.json", JSON.stringify(pluginsEnabled));
                    methods.sendMessage(message.chat.id, "Plugin \"" + matches[2] + "\" disabled!", null, message.message_id);
                    plugin_manager.reloadPlugins();
                    return;
                }
                else if (matches[3] == "list")
                {
                    var response_text = "";
                    for (i in plugin_manager.plugins_list)
                    {
                        var plugin = plugin_manager.plugins_list[i];
                        if(plugin == "plugin_manager")
                        {
                            continue;
                        }
                        var enabled = false;
                        if (pluginsEnabled.indexOf(plugin) != -1)
                        {
                            enabled = true;
                        }
                        response_text += plugin + " " + (enabled ? emoji.get("white_check_mark") : emoji.get("x")) + "\n";
                    }
                    methods.sendMessage(message.chat.id, response_text, null, message.message_id);
                }
            }
            catch (e)
            {
                debug.err(e);
            }
        }
    }
}

plugin_manager.properties = {
    name: "Plugin manager",
    friendlyName: "plugin_manager",
    description: "This plugin allows some superusers to enable/disable some plugins on-the-fly",
    usage: "Type /plugin <enable/disable> <pluginFriendlyName>",
    version: "1.0.0"
}

module.exports = plugin_manager;