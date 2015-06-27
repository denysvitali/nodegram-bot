var methods = require("../../methods");
var debug = require("../../debug");

var clear = {};

clear.parseTextMsg = function(message)
{
    if (message.text == "/clear" || message.text == "/clear@" + clear._globals.me.username)
    {
        var text = "";
        for (i = 0; i < 50; i++)
        {
            text += '\u200d' + "\n";
        }
        methods.sendMessage(message.chat.id, text);
    }
}

clear.usage = function()
{
    var msg = "";
    msg += "This plugins clears the chat\n"
    msg += "Type /clear to invoke Mr.Clean"
    return msg;
}

clear._globals = {};
clear.setGlobals = function(globals)
{
    this._globals = globals;
}



clear.properties = {
    name: "Clear",
    friendlyName: "clear",
    description: "This plugins clears the chat",
    usage: "Type /clear to invoke Mr.Clean",
    version: "1.0.0"
}

module.exports = clear;