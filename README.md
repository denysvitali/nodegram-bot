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

