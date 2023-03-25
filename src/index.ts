import { Client, GatewayIntentBits, Events, Message, ChannelType } from 'discord.js';

const token: string = "your-token";

const newIntents: GatewayIntentBits[] = [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
];

const client: Client = new Client({
    intents: newIntents
});

client.on(Events.ClientReady, () => {
    console.log(`Successfully Logged in as ${client.user?.tag}!`);
});

function sumOf(input: number[]): number {
    let total: number = 0;
    input.forEach(num => total+=num);
    return total;
}

const commandRegEx: RegExp = /(([0-9]+d)|(d))+[0-9]/i;
client.on(Events.MessageCreate, (message: Message) => {
    if (!commandRegEx.test(message.content)) return;
    if (message.channel.type != ChannelType.GuildText) return;
    if (!message.channel.name.toLowerCase().includes("roll")) return;
    
    const values:string[] = message.content.toLowerCase().split("d").join("./").split(/\+|\-/).join("./").split("./");
    if (values[0] == "") values[0] = "1";

    let ranNums: number[] = [];
    for (var i: number = 0; i < parseInt(values[0], 10); i++) {
        const ran: number = Math.floor(Math.random() * parseInt(values[1], 10));
        ranNums.push(ran+1);
    }

    let netTotal: number = sumOf(ranNums);
    let output: string = `**You rolled: \`${ranNums.sort((a,b)=>a-b)}\`. Total: \`${netTotal}\`.**`;
    if (message.content.includes("+")) output += ` **Total with modifier: \`${netTotal + parseInt(values[1], 10)}\`**`;
    if (message.content.includes("+")) output += ` **Total with modifier: \`${netTotal - parseInt(values[1], 10)}\`**`;
    message.reply(output); 
});

client.login(token);