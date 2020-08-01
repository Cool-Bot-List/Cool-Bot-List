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
    socket.on("new-bot", async (data) => {
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;
        const r = await fetch(`http://localhost:5000/api/users${owners[0]}`);
        const user = await r.json();
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
        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("bot-update", async (data) => {
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;
        const r = await fetch(`http://localhost:5000/api/users${owners[0]}`);
        const user = await r.json();
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
        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("bot-delete", async (data) => {
        const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = data;
        const r = await fetch(`http://localhost:5000/api/users${owners[0]}`);
        const user = await r.json();
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
        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("new-review", async (data) => {
        const { userId, review, rating, botId } = data;
        const r = await fetch(`http://localhost:5000/api/user/${userId}`);
        const user = await r.json();
        const embed = new MessageEmbed().setTitle("A new review was made").setAuthor(`${user.tag}(review author)`, user.avatarUrl);
        let embedDescription = "";
        if (userId) embedDescription += `userId: ${userId}\n\n`;
        if (botId) embedDescription += `botId: ${botId}\n\n`;
        if (review) embedDescription += `review: ${review}\n\n`;
        if (rating) embedDescription += `rating: ${rating}\n\n`;
        embed.setDescription(embedDescription);
        logChannel.send(embed);
        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("new-notification", (data) => {
        const embed = new MessageEmbed().setTitle("A new notification was made").setAuthor(data.tag, data.avatarUrl).setThumbnail(data.avatarUrl);
        for (const noti of data.notifications) embed.addField("notification", `${noti.message} read: ${noti.read}`);
        logChannel.send(embed);
        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("notification-update", (data) => {
        const embed = new MessageEmbed().setTitle("A notification was updated.").setAuthor(data.tag, data.avatarUrl).setThumbnail(data.avatarUrl);
        for (const noti of data.notifications) embed.addField("notification", `${noti.message} read: ${noti.read}`);
        logChannel.send(embed);
        logChannel.send(`\`\`\`js\n${JSON.stringify(data, null, 4)}\`\`\``);
    });
    socket.on("vote", (user, bot) => {
        const embed = new MessageEmbed()
            .setAuthor(`${user.tag} voted for ${bot.tag}`, user.avatarUrl)
            .setThumbnail(bot.avatarUrl)
            .setDescription(`**Total Votes -** ${bot.votes}`);
        logChannel.send(embed);
    });
    socket.on("owner-reply", (review, ownerSchema, userSchema) => {
        const embed = new MessageEmbed()
            .setAuthor(`${ownerSchema.tag} replied to ${userSchema.tag}'s review!`, ownerSchema.avatarUrl)
            .setDescription(`Review - ${review.review}\nReply - ${review.ownerReply.review}`)
            .setThumbnail(userSchema.avatarUrl);
        logChannel.send(embed);
    });
});