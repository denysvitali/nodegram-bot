var methods = require("../../methods");
var debug = require("../../debug");

var clear = {};

clear.parseTextMsg = function(message)
{
    if (message.text == "/clear")
    {
        var text = "";
        for (i = 0; i < 50; i++)
        {
            text += '\u200d' + "\n";
        }
        methods.sendMessage(message.chat.id, text);
    }
}

module.exports = clear;