var methods = require("../../methods");
var debug = require("../../debug");

var help = {};
var fs = require('fs');

help.parseTextMsg = function(message)
{

    try
    {
        var plugins_enabled = JSON.parse(fs.readFileSync(__dirname + "/../../data/plugins_enabled.json"));
    }
    catch (e)
    {
        debug.err(e);
    }

    if (message.text == "/help" || message.text == "/help@"+help._globals.me.username)
    {
        if (this._PMPlugins.length == 0)
            return;

        var pluginListText = "";

        for (i in this._PMPlugins)
        {
            if(plugins_enabled.indexOf(this._PMPlugins[i].properties.friendlyName) != -1)
            {
                pluginListText += this._PMPlugins[i].properties.name + " (" + this._PMPlugins[i].properties.friendlyName + ")\n";
            }
        }

        pluginListText += "\nIf you want to see the usage for every plugin type /help <plugin friendly name> (for example /help genmeme)";
        methods.sendMessage(message.chat.id, pluginListText, null, message.message_id);
        return;
    }
    var regexp = new RegExp("^\/help(?:@"+help._globals.me.username+"|) (.*)$");
    var match = message.text.match(regexp);
    if (match)
    {
        for (i in this._PMPlugins)
        {
            var currPlugin = this._PMPlugins[i];
            if (currPlugin.properties.friendlyName == match[1] && plugins_enabled.indexOf(currPlugin.properties.friendlyName))
            {
                var pluginInfo = "";
                pluginInfo += "Name: " + currPlugin.properties.name + "\n";
                pluginInfo += "FriendlyName: " + currPlugin.properties.friendlyName + "\n";
                pluginInfo += "Description: " + currPlugin.properties.description + "\n";
                pluginInfo += "Version: " + currPlugin.properties.version + "\n";
                pluginInfo += "Usage: " + currPlugin.properties.usage;
                methods.sendMessage(message.chat.id, pluginInfo, null, message.message_id);
                break;
            }
        }
    }
}

help._globals = {};
help.setGlobals = function(globals)
{
    this._globals = globals;
}

help._PMPlugins = {};
help.setPMPlugins = function(globals)
{
    this._PMPlugins = globals;
}

help.properties = {
    name: "Help",
    friendlyName: "help",
    description: "This plugin ",
    usage: "Type /help to receive help with the usage of this bot",
    version: "1.0.0"
}

module.exports = help;