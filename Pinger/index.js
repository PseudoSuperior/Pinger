const Discord = require("discord.js");
const { Client, MessageEmbed, Collection, VolumeInterface } = require("discord.js");
const ping = require("./models/Pinger.js");

const { config } = require("dotenv")
config({
    path: __dirname + "/.env"
});

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000, useCreateIndex: true, keepAlive: 1, useFindAndModify: false}).then(() => {
  console.log("Connected to MongoDB!");
})
.catch((err) => {
  console.error("Failed to connect to MongoDB:");
  console.error(err.toString());
});

const client = new Client({disableEveryone:true, disableMentions:"everyone"});

client.once('ready', () => {
    console.log("Ready!");
    client.user.setActivity("with your Notifications ‼🗣", {type: 'PLAYING'});
});

client.on("message", async message => {
    const args = message.content.trim().split(/ +/g);

//Pinging Business=======
if (message.content.startsWith(`??ping`)) {

if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`You need __**ADMIN**__ Perms for this to work ‼`)
     
    if(!args[0]) return message.reply("No message specified!\n__**Correct Usage**__: `??ping <Message to appear along with Ping>`")
    var string = args.slice(0).join(" ");

let doc = await ping.findOne({ guildId: message.guild.id });
const members = message.guild.members.cache;
if (!doc) {
  doc = new ping({
    guildId: message.guild.id,
    text:string,
    members: Array.from(members.values()).map(x => {return {id: x.id,done: false}})
                          });
  await doc.save();
}
for (let i = 0; i < doc.members.length; i++) {
  const memberEntry = doc.members[i];
  if (memberEntry.done) continue;
  const member = members.get(memberEntry.id);
  if (!member || member.user.bot) continue;
  await message.channel.send(`${member.toString()} ${doc.text}`).then(m => m.delete({timeout:100}));
  doc.members[i].done = true;
  doc.markModified(`members.${i}`);
  await doc.save();
  await new Promise(r => setTimeout(r, 5000));
}
  }
//====================================================================================================================
})

client.login(process.env.BOT_TOKEN);
