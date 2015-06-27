<img src="http://i.imgur.com/Tz2m0v9.png" width=150 />
# nodegram-bot
A Telegram-bot written in Node.JS

![The trend plugin](http://i.imgur.com/Lz5oYTV.png)

## First things first
To make your bot working you have to gather somehow a valid SSL certificate, because as stated in the docs of Telegram 
> Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized Update.

This is the most tricky part. Once you've set-up your domain with the SSL certificate (maybe gathered from [StartSSL](https://www.startssl.com/) you could proceed to the configuration of apache.

### Virtual Hosts, oh, virtual hosts
In my setup I used two Apache2 servers,
I know, don't blame me, it was due to a management choice.
In this section we'll keep it simple and illustrate how to configure the Proxy Server (apache2)

```
<VirtualHost *:443>
#SSL setup
SSLEngine on
SSLProtocol all -SSLv2 -SSLv3
SSLCertificateFile "/etc/apache2/ssl/denvit.work.crt"
SSLCertificateKeyFile "/etc/apache2/ssl/denvit.work.pem"
SSLCertificateChainFile "/etc/apache2/ssl/startssl.pem"
SSLCertificateChainFile "/etc/apache2/ssl/sub.class1.server.ca.startssl.pem"

#Host info
ServerName denvit.work
ServerAlias vps.denvit.work

ProxyPreserveHost On
ProxyPass / http://127.0.0.1:30303/
ProxyPassReverse / http://127.0.0.1:30303/
</VirtualHost>
```

Things you probably need to change:

-	SSLCertificateFile, this is the path of your SSL certificate file
-	SSLCertificateKeyFile, this is the key of your SSL pair
-	ServerName, this is your hostname. The one specified into the settings.js file
-	ServerAlias, this is an alias for your virtualhost (in my case it's also reachable via https://vps.denvit.work/)

Set up everything as this and just change it as you need.
The port should be 30303 if you didn't changed it into settings.js 

## Plugins

### Plugin manager
![The plugin manager](http://i.imgur.com/XNkbj6p.png)

This is the father of every plugin,
its job is to enable and disable the plugins on the fly when a **superuser** wants to.
The list of enabled plugins is kept, so you don't have to manually reenable everything at startup (check data/plugins_enabled.json for more info)

#### Usage
`/plugin list`

List every plugin available (and their status)

`/plugin enable <plugin name>`

Enables a plugin

`/plugins disable <plugin name>`

Disable a plugin

`/getmyid`

Shows your ID, this is very useful if you want to add yourself to the superusers and you look for your id


### Help
![The help plugin](http://i.imgur.com/2ahFz1A.png)

This plugin takes care of supplying all the usage information about the plugins to the user when requested

#### Usage
`/help`

Shows the general help, based on the enabled plugins

`/help <plugin friendly name>`

Shows the plugin informations (Name, Friendly Name, Description and Usage)


### Genmeme
Creates a meme based on a your google images search keywords and the text(s) you provide
![Genmeme plugin](http://i.imgur.com/Cd9jLLD.png)

#### Usage
`/genmeme image keywords-top text-bottom text`

### Trends
Show a graph of trend based on Google Trends
![Trends plugin](http://i.imgur.com/Lz5oYTV.png)

#### Usage
`/trend trend1,trend2[,trend3,...]`

### Clear
<img src="http://i.imgur.com/spw9x7a.jpg" height=100 /> 

Did you ever thought of cleaning your chat?
Now you can, with Mr.Clean!

#### Result
(obviously the output is more longer)
![Clear](http://i.imgur.com/YKA10z2.png)

#### Usage
`/clear`

### Version
Shows the version of the nodegram-bot

#### Result
![Version](http://i.imgur.com/GMtKSXu.png)

#### Usage
`/version`