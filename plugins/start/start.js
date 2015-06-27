var methods = require("../../methods");
var debug = require("../../debug");

var start = {};

start.parseTextMsg = function(message)
{
    if (message.text == "/start" || message.text == "/start@"+start._globals.me.username)
    {
        var text = "";
        text += "Hi there!\n";
        text += "My name is " + start._globals.me.name + " and I'm a bot written in Node.JS.\n\n";
        text += "If you want to see my commands type /help.\nIf you want to build your own type /version to get the GitHub link.";
        methods.sendMessage(message.chat.id, text, null, message.message_id);
    }
}

start._globals = {};
start.setGlobals = function(globals)
{
    this._globals = globals;
}

start.properties = {
    name: "Start",
    friendlyName: "start",
    description: "This plugin sends a greeting to the user",
    usage: "Type /start to receive the greeting",
    version: "1.0.0"
}

module.exports = start;