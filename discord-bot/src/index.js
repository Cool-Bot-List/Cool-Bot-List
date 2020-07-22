require("dotenv").config();
const { Client, MessageEmbed } = require("discord.js");
const io = require("socket.io-client");
const client = new Client();
require("dotenv").config();
client.login(process.env.BOT_TOKEN);

const socket = io("http://localhost:5000");

client.on("ready", async () => {
    console.log("Discord Bot has logged in.");
    const logChannel = await client.channels.cache.get("735286894421606400");

    socket.on("new-user", (data) => {
        data = JSON.parse(data);
        console.log("on new-user triggered");
        if (logChannel) {
            logChannel.send("a new user was made");
            const embed = new MessageEmbed().setTitle("new user").addField("id", data.id).addField("id", data.id).addField("bio", data.bio);
            logChannel.send(embed);

            logChannel.send(data);
        }
    });
    socket.on("new-bot", (data) => {
        const embed = new MessageEmbed().setDescription(`id:${data.id}\nName:${data.name}\nPrefix:${data.prefix}\nDescription:${data.description}\nowners:${data.owners}\nwebsite:${data.website}\nhelpCommand:${data.helpCommand}\nsupportServer:${data.supportServer}\nlibrary:${data.library}\nreviews:none the bot was just created`).setTitle("A new user was created.");
        logChannel.send("A new user was created.");
        logChannel.send(embed);
    });
});
