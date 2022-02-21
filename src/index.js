const token = "insert-token-here";

const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILDS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_PRESENCES",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS",
    ],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {


    // Seaching Dividing and Defining different parts of the message into; The amount of times the dice is to be rolled, The Dice Size, The Modifier's expression [+, -, *, /], and the actual number modifier itself.

    if (msg.author.bot) return;
    let message = {};
    message.content = msg.content.split(' ').join('');
    if (!msg.channel.name.match(/roll|doom/)) return;
    if (!message.content.match(/d[0-9]|D[0-9]/)) return;
    const a = message.content.split(/d|D/);
    let rolls = undefined;
    if (a.length > 1) rolls = a.shift();
    const args = a.join('').split(' ');
    const b = args.join('');
    const c = b.split('');
    let pos;
    let diceSize;
    let expression
    let modifier;
    if (c.lastIndexOf('+') != -1) pos = c.lastIndexOf('+');
    if (c.lastIndexOf('-') != -1) pos = c.lastIndexOf('-');
    if (c.lastIndexOf('*') != -1) pos = c.lastIndexOf('*');
    if (c.lastIndexOf('/') != -1) pos = c.lastIndexOf('/');
    if (pos) {
        diceSize = c.splice(0, pos).join('');
        expression = c.shift().toString();
        modifier = c.join('');
    } else {
        diceSize = c.join('')
    }


    // Get the Random Numbers and apply the modifiers if given.

    let randNums = [];
    let finalValue;
    if (parseInt(rolls, 10) > 1) {
        for (var i = 0; i <= parseInt(rolls, 10); i++) {
            if (i == parseInt(rolls, 10)) {
                const randEquated = randNums.reduce((a, b) => (a + b), 0)
                if (expression == "+") finalValue = randEquated + parseInt(modifier, 10);
                if (expression == "-") finalValue = randEquated - parseInt(modifier, 10);
                if (expression == "*") finalValue = randEquated * parseInt(modifier, 10);
                if (expression == "/") finalValue = randEquated / parseInt(modifier, 10);
                if (!expression) finalValue = randEquated;
                msg.reply(`You rolled; \`${randNums.join(', ')}\`. Which totals to: \`${finalValue}\``)
                return;
            };
            randNums.push(Math.floor(Math.random() * diceSize));
        }
    } else {
        const randNum = Math.floor(Math.random() * diceSize);
        if (expression == "+") finalValue = randNum + parseInt(modifier, 10);
        if (expression == "-") finalValue = randNum - parseInt(modifier, 10);
        if (expression == "*") finalValue = randNum * parseInt(modifier, 10);
        if (expression == "/") finalValue = randNum / parseInt(modifier, 10);
        if (!expression) finalValue = randNum;
        msg.reply(`You rolled; \`${randNum}\`. Which totals to: \`${finalValue}\``)
    }
});

client.login()