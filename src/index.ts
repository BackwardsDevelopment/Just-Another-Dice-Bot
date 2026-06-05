import { config as envConfig } from "dotenv";
import { Client, Events, GatewayIntentBits, Message } from "discord.js";
import { ExtendedClient } from "./client/client.js";
import { evalModifiers, randInt } from "./lib/helpers.js";
envConfig();

const intents: GatewayIntentBits[] = [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
];

const client = new ExtendedClient({ intents });

client.once(Events.ClientReady, (c: Client) => {
    console.log(`Successfully logged in as ${client.user?.username}`);
});

const rollRegex = /([0-9]*)?d([0-9]*)(.*)/i;

client.on(Events.MessageCreate, async (message: Message) => {

    if (message.author.bot)
        return;

    if (message.content === ";setrollchannel") {
        await client.saveChannel(message.channelId);
        message.reply("Set this channel as a rolls channel.");
        return;
    }
    if (message.content === ";delrollchannel") {
        await client.removeChannel(message.channelId);
        message.reply("Remove this channel as a rolls channel");
        return;
    }

    console.log(message.channelId);
    if (!await client.isChannel(message.channelId)) {
        console.log("not a channel");
        return;
    }

    const content = message.content;

    const dice_stats = content.match(rollRegex);

    if (dice_stats == null)
        return;

    let quantity = 1;
    let size = 0;
    let modifiers = "";

    if (dice_stats[1] !== undefined) {
        quantity = parseInt(dice_stats[1] || "");
    }
    size = parseInt(dice_stats[2] || "");
    if (dice_stats[3] !== undefined) {
        modifiers = dice_stats[3];
    }

    const rolls = [];
    for (let i = 0; i < quantity; i++) {
        rolls.push(randInt(size));
    }
    let out = "";
    out += `Rolled ${quantity} d${size}${quantity > 1 ? "s" : ""}\n`;
    out += rolls.map(roll => `\`${roll}\``).join(" ") + "\n";
    if (modifiers)
        out += "M: " + rolls.map(roll => `\`${evalModifiers(roll, modifiers)}\``).join(" ") + "\n";
    out += `Sum: \`${rolls.reduce((accumulator: number, current: number) => accumulator + current, 0)}\``;
    if (modifiers)
        out += `\nSum (M): \`${evalModifiers(rolls.reduce((accumulator: number, current: number) => accumulator + current, 0), modifiers)}\``;
    if (out.length > 4000) {
        message.reply("Invalid response: Response too long. Too many dice?");
        return;
    }
    message.reply({ content: out });
});

client.login(process.env.TOKEN);
