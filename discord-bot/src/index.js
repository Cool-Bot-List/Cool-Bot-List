require("dotenv").config();
const { Client, MessageEmbed, Message } = require("discord.js");
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
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;

        const user = client.users.cache.get(owners[0]);
        const embed = new MessageEmbed().setTitle("A New Bot Was Made").setAuthor(`${user.username}(first element is owners array)`, user.displayAvatarURL());
        let embedDescription;
        if (id) embedDescription += `id: ${id}\n\n`;
        if (name) embedDescription += `name: ${name}\n\n`;
        if (prefix) embedDescription += `prefix: ${prefix}\n\n`;
        if (description) embedDescription += `desciption: ${description}\n\n`;
        if (owners) embedDescription += `owners: ${owners}\n\n`;
        if (website) embedDescription += `website: ${website}\n\n`;
        if (helpCommand) embedDescription += `help command: ${supportServer}\n\n`;
        if (library) embedDescription += `libary: ${library}\n\n`;
        embed.setDescription(embedDescription);
        logChannel.send(embed);
    });
    socket.on("bot-update", (data) => {
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;

        const user = client.users.cache.get(owners[0]);
        const embed = new MessageEmbed().setTitle("A Bot Was Updated").setAuthor(`${user.username}(first element is owners array)`, user.displayAvatarURL());
        let embedDescription;
        if (id) embedDescription += `id: ${id}\n\n`;
        if (name) embedDescription += `name: ${name}\n\n`;
        if (prefix) embedDescription += `prefix: ${prefix}\n\n`;
        if (description) embedDescription += `desciption: ${description}\n\n`;
        if (owners) embedDescription += `owners: ${owners}\n\n`;
        if (website) embedDescription += `website: ${website}\n\n`;
        if (helpCommand) embedDescription += `help command: ${supportServer}\n\n`;
        if (library) embedDescription += `libary: ${library}\n\n`;
        embed.setDescription(embedDescription);
        logChannel.send(embed);
    });
});
