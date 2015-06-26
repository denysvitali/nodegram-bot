var methods = require("../../methods");
var debug = require("../../debug");
var emoji = require('node-emoji');
var utils = require("../../utils");


var fs = require('fs');

var poll = {};

function UnixNow()
{
    return Date.now() / 1000 | 0;
}

poll.printClosingResult = function(type, poll_json)
{
    var text_final = "";
    switch (type)
    {
        case 1:
            text_final += ".\n\n";
            break;

        case 2:
            text_final += "We're closing the older poll named \"" + poll_json.title + "\" because it had no answer from anyone in the last 6 hours and a new poll is needed.\n\n";
            break;

        case 3:
            text_final += "Final results:\n\n";
            break
    }
    text_final += "Poll result:\n";
    poll_json.results.sort(function(a, b)
    {
        if (a.length > b.length)
        {
            return -1;
        }
        else if (a.length < b.length)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    });

    for (i in poll_json.results)
    {
        var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        var thereal_i = Object.keys(poll_json.results)
            .indexOf(i);
        if (thereal_i < 9)
        {
            number = emoji.get(numbers[thereal_i]);
        }
        else
        {
            number = thereal_i + 1;
        }
        var keys = Object.keys(poll_json.results);
        text_final += number + " - " + i + "\n";

        var percent = poll_json.results[i].votedBy.length / poll_json.participants.length * 100;
        var base10 = Math.round(percent / 10);

        for (i2 = 1; i2 <= base10; i2++)
        {
            text_final += emoji.get("white_square_button");
        }
        text_final += " (" + percent + "%)\n\n";
    }

    if (type == 3)
    {
        text_final += "If you want to create a new poll send /newpoll";
    }
    return text_final;
}

var awaiting_reply = [];

poll.parseTextMsg = function(message)
{
    var thisone = this;
    if (message.text == "/newpoll")
    {
        var forceReply = {
            force_reply: true,
            selective: true
        };
        try
        {
            /*var file = fs.readFileSync(__dirname + "/activepolls/" + message.chat.id + ".json");
            var json = JSON.parse(file);
            if (json.last_update - UnixNow() > 60 * 60 * 6)
            {
                //Max 6 hours without an update before being able to close it
                poll.printClosingResult(2, json);
            }*/
        }
        catch (e)
        {
            // no active polls
        }

        methods.sendMessage(message.chat.id, "Okay, write me the question of the poll", null, message.message_id, forceReply)
            .then(function(message)
            {
                console.log(message);
                awaiting_reply.push(
                {
                    "last_msg_id": message.message_id,
                    type: 1
                });
            });
    }
    else if (message.text == "/results")
    {
        debug.info("Asked results");
        for (i in awaiting_reply)
        {
            console.log(awaiting_reply);
            if (awaiting_reply[i].type == 4)
            {
                debug.info("Found type 4");
                if (awaiting_reply[i].chat_id == message.chat.id)
                {
                    debug.info("Found poll!");
                    var result_text = thisone.printClosingResult(1, awaiting_reply[i].poll);
                    methods.sendMessage(message.chat.id, result_text);
                }
            }
        }
    }

    if (message.hasOwnProperty("reply_to_message"))
    {
        debug.info("Okay, has property!");
        console.log(awaiting_reply);
        //The message is a reply
        for (i in awaiting_reply)
        {
            if (awaiting_reply[i].last_msg_id == message.reply_to_message.message_id)
            {
                debug.info("Found a reply message we were waiting for...");
                //Found message
                var ar = awaiting_reply[i];
                awaiting_reply[i].processed = true;
                switch (ar.type)
                {
                    case 1:
                        // Poll name
                        var poll_title = message.text;
                        var forceReply = {
                            force_reply: true,
                            selective: true
                        };
                        methods.sendMessage(message.chat.id, "Send me a possible answer", null, message.message_id, forceReply)
                            .then(function(message)
                            {
                                ar.last_msg_id = message.message_id;
                                ar.chat_id = message.chat.id;
                                ar.type = 2;
                                ar.poll = {
                                    title: poll_title
                                };
                                awaiting_reply.push(ar);
                            });
                        break;

                    case 2:
                        var forceReply = {
                            force_reply: true,
                            selective: true
                        };
                        ar.poll.answers = [message.text];
                        methods.sendMessage(message.chat.id, "Send me a another possible answer", null, message.message_id, forceReply)
                            .then(function(message)
                            {
                                ar.last_msg_id = message.message_id;
                                ar.type = 3;
                                awaiting_reply.push(ar);
                            });
                        break;
                    case 3:
                        //has at least 2 answes
                        if (message.text == "/done")
                        {
                            var poll = {
                                title: ar.poll.title,
                                answers: ar.poll.answers,
                                createdby: message.from.id,
                                results: [],
                                participants: []
                            };
                            //fs.writeFileSync(__dirname + "/activepolls/" + message.chat.id + ".json", json_string);

                            var rkm = {
                                keyboard: [poll.answers],
                                force_reply: true,
                                resize_keyboard: true,
                                one_time_keyboard: true,
                                selective: false
                            }
                            console.log(poll.answers);
                            var formatted_poll_question = "";
                            formatted_poll_question += emoji.get("arrow_right") + emoji.get("arrow_right") + " " +
                                poll.title + " " + emoji.get("arrow_left") + emoji.get("arrow_left");
                            formatted_poll_question += "\n";
                            for (i in poll.answers)
                            {
                                var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
                                if (i < 9)
                                {
                                    number = emoji.get(numbers[i]);
                                }
                                else
                                {
                                    number = i + 1;
                                }
                                formatted_poll_question += number + " - " + poll.answers[i] + "\n";
                            }

                            methods.sendMessage(message.chat.id, formatted_poll_question, null, null, rkm)
                                .then(function(message)
                                {
                                    ar.last_msg_id = message.message_id;
                                    ar.type = 4;
                                    ar.poll = poll;
                                    awaiting_reply.push(ar);
                                });
                            break;
                        }

                        var forceReply = {
                            force_reply: true,
                            selective: true
                        };
                        ar.poll.answers.push(message.text);

                        methods.sendMessage(message.chat.id, "Okay, you may now close the poll with /done or send me another answer", null, message.message_id, forceReply)
                            .then(function(message)
                            {
                                ar.last_msg_id = message.message_id;
                                ar.type = 3;
                                awaiting_reply.push(ar);
                            });
                        break;

                    case 4:
                        //Voting
                        if (ar.poll.participants.indexOf(message.from.id) != -1)
                        {
                            methods.sendMessage(message.chat.id, "You cannot vote twice.", null, message.message_id);

                            ar.type = 4;
                            ar.processed = true;
                            awaiting_reply.push(ar);
                            break;
                        }

                        if (ar.poll.answers.indexOf(message.text) != -1)
                        {
                            if (typeof(ar.poll.results[message.text]) != "object")
                            {
                                ar.poll.results[message.text] = {};
                                ar.poll.results[message.text].votedBy = [];
                            }

                            ar.poll.results[message.text].votedBy.push(message.from.id);
                            ar.poll.participants.push(message.from.id);

                            methods.sendMessage(message.chat.id, "Got a vote for \"" + message.text + "\"", null, message.message_id, forceReply)
                                .then(function(message)
                                {
                                    //ar.last_msg_id = message.message_id;
                                    ar.type = 4;
                                    awaiting_reply.push(ar);
                                });
                        }
                        break;
                }
            }
        }

        for (i in awaiting_reply)
        {
            if (awaiting_reply[i].hasOwnProperty("processed"))
            {
                if (awaiting_reply[i].processed)
                {
                    delete awaiting_reply[i];
                }
            }
        }
    }
}

poll.parse

module.exports = poll;