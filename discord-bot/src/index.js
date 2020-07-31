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
        console.log("on new-user triggered");
        if (data.bio === "") data.bio = "was a space (filtered out to this so this message could send";

        logChannel.send("a new user was made");
        const embed = new MessageEmbed().setTitle("a new user was made").addField("id", data.id).addField("bio", data.bio).addField("tag", data.tag).addField("avatarUrl", data.avatarUrl).setAuthor(data.tag, data.avatarUrl);
        logChannel.send(embed);

        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("user-update", (data) => {
        if (data.bio === "") data.bio = "was a space (filtered out to this so this message could send";
        logChannel.send("a user was updated");
        const embed = new MessageEmbed().setTitle("a user was updated").addField("id", data.id).addField("bio", data.bio).addField("tag", data.tag).addField("avatarUrl", data.avatarUrl).setAuthor(data.tag, data.avatarUrl);
        logChannel.send(embed);

        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("user-delete", (data) => {
        if (data.bio === "") data.bio = "was a space (filtered out to this so this message could send";
        logChannel.send("a user was deleted");
        const embed = new MessageEmbed().setTitle("a user was deleted").addField("id", data.id).addField("bio", data.bio).addField("tag", data.tag).addField("avatarUrl", data.avatarUrl).setAuthor(data.tag, data.avatarUrl);
        logChannel.send(embed);

        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("new-bot", (data) => {
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;

        const user = client.users.cache.get(owners[0]);
        const embed = new MessageEmbed().setTitle("A New Bot Was Made").setAuthor(`${user.username}(first element is owners array)`, user.displayAvatarURL());
        let embedDescription = "";
        if (id) embedDescription += `id: ${id}\n\n`;
        if (name) embedDescription += `name: ${name}\n\n`;
        if (prefix) embedDescription += `prefix: ${prefix}\n\n`;
        if (description) embedDescription += `description: ${description}\n\n`;
        if (owners) embedDescription += `owners: ${owners}\n\n`;
        if (website) embedDescription += `website: ${website}\n\n`;
        if (helpCommand) embedDescription += `help command: ${supportServer}\n\n`;
        if (library) embedDescription += `library: ${library}\n\n`;
        embed.setDescription(embedDescription);
        logChannel.send(embed);
    });
    socket.on("bot-update", (data) => {
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;

        const user = client.users.cache.get(owners[0]);
        const embed = new MessageEmbed().setTitle("A Bot Was Updated").setAuthor(`${user.username}(first element is owners array)`, user.displayAvatarURL());
        let embedDescription = "";
        if (id) embedDescription += `id: ${id}\n\n`;
        if (name) embedDescription += `name: ${name}\n\n`;
        if (prefix) embedDescription += `prefix: ${prefix}\n\n`;
        if (description) embedDescription += `description: ${description}\n\n`;
        if (owners) embedDescription += `owners: ${owners}\n\n`;
        if (website) embedDescription += `website: ${website}\n\n`;
        if (helpCommand) embedDescription += `help command: ${supportServer}\n\n`;
        if (library) embedDescription += `library: ${library}\n\n`;
        embed.setDescription(embedDescription);
        logChannel.send(embed);
    });
    socket.on("bot-delete", (data) => {
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;

        const user = client.users.cache.get(owners[0]);
        const embed = new MessageEmbed().setTitle("A Bot Was Deleted").setAuthor(`${user.username}(first element is owners array)`, user.displayAvatarURL());
        let embedDescription = "";
        if (id) embedDescription += `id: ${id}\n\n`;
        if (name) embedDescription += `name: ${name}\n\n`;
        if (prefix) embedDescription += `prefix: ${prefix}\n\n`;
        if (description) embedDescription += `description: ${description}\n\n`;
        if (owners) embedDescription += `owners: ${owners}\n\n`;
        if (website) embedDescription += `website: ${website}\n\n`;
        if (helpCommand) embedDescription += `help command: ${supportServer}\n\n`;
        if (library) embedDescription += `library: ${library}\n\n`;
        embed.setDescription(embedDescription);
        logChannel.send(embed);
    });
    socket.on("new-review", (data) => {
        const { userId, review, rating, botId } = data;

        const user = client.users.cache.get(userId);
        const embed = new MessageEmbed().setTitle("A new review was made").setAuthor(`${user.username}(review author)`, user.displayAvatarURL());
        let embedDescription = "";
        if (userId) embedDescription += `userId: ${userId}\n\n`;
        if (botId) embedDescription += `botId: ${botId}\n\n`;
        if (review) embedDescription += `review: ${review}\n\n`;
        if (rating) embedDescription += `rating: ${rating}\n\n`;
        embed.setDescription(embedDescription);
        logChannel.send(embed);
    });
    socket.on("new-notification", (data) => {
        const embed = new MessageEmbed().setAuthor();
    });
});
