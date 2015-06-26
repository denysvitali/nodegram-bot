var methods = require("../methods");
var debug = require("../debug");

var test = {};

test.parseTextMsg = function(message)
{
	console.log("Parsing message from plugin!");
	console.log(message.text);

	if(message.text == "/test")
	{
		methods.sendMessage(message.chat.id, "Your test worked perfectly!", null, message.message_id);
	}
}

/*test.parseStickerMsg = function(message)
{
	debug.info("Got a sticker, yay!");
	methods.sendSticker(message.chat.id, "BQADAgADHAADyIsGAAFZfq1bphjqlgI");
}*/

module.exports = test;