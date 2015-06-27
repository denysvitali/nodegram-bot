var methods = require("../../methods");
var debug = require("../../debug");

var version = {};

version.parseTextMsg = function(message)
{
	if(message.text == "/version" || message.text == "/version@"+version._globals.me.username)
	{
		var formatted_version = "";
		formatted_version += "nodegram-bot\n";
		formatted_version += "Version: "+this._globals.nodegramV+"\n";
		formatted_version += this._globals.githubUrl
		methods.sendMessage(message.chat.id, formatted_version, null, message.message_id);
	}
}

version._globals = {};
version.setGlobals = function(globals)
{
	this._globals = globals;
}

version.properties = {
    name: "Version",
    friendlyName: "version",
    description: "This plugin shows the current version of nodegram-bot",
    usage: "Type /version to see the nodegram-bot version",
    version: "1.0.0"
}

module.exports = version;