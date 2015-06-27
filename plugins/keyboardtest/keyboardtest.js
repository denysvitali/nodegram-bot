var methods = require("../../methods");
var debug = require("../../debug");
var emoji = require('node-emoji');

var keyboardtest = {};

keyboardtest.parseTextMsg = function(message)
{
    if (message.text == "/keyboardtest" || message.text == "/keyboardtest@"+keyboardtest._globals.me.username)
    {
        var rkm = {
            keyboard: [[emoji.get('coffee'), emoji.get('heart'),emoji.get('banana'), emoji.get('dog')], ["2R_1", "2R_2", "2R_3", "2R_4"]],
            resize_keyboard: true,
            one_time_keyboard: false,
            selective: true
        }
        methods.sendMessage(message.chat.id, "Your test worked perfectly!", null, message.message_id, rkm);
    }
}

keyboardtest._globals = {};
keyboardtest.setGlobals = function(globals)
{
    this._globals = globals;
}

keyboardtest.properties = {
    name: "Keyboard test",
    friendlyName: "keyboardtest",
    description: "This plugins was created just to test the keyboard feature of Telegram v3+",
    usage: "Type /keyboardtest to show the keyboard",
    version: "1.0.0"
}

module.exports = keyboardtest;