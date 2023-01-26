//Imports the dotenv package and discord.js package, as well as configuration and OpenAIApi from the OpenAi package
import { config } from "dotenv"
import pkg from 'discord.js';
const { Client, GatewayIntentBits, Routes, EmbedBuilder } = pkg;
import { Configuration, OpenAIApi } from "openai"

//Configure environment variables from the .env file
config()
const BOT_TOKEN = process.env.BOT_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

//Creates a new client object with the intents and gateway bits that the bot needs
const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
})

//Creates a new configuration object with the OpenAI api key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//Creates a new OpenAIApi object with the configuration object
const openai = new OpenAIApi(configuration);

//Logs the client into the Discord server using the provided token
client.login(BOT_TOKEN)

//Logs a message to the console when the client is ready
client.on("ready", () => { console.log(`Logged in as ${client.user.tag}!`) })

//When the client receives a message, it will create a prompt from the message content, 
//send the prompt to OpenAI to generate a response, 
//and then send the response back to the message author in the discord server
client.on("messageCreate", async (msg) => {
    if (msg.author == client.user) { return }
    if (msg.author.bot) { return }
    const prompt = `input: ${msg.content} output:`
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["input:"],
    })
    console.log(prompt)
    let reply = (response.data.choices[0].text)
    msg.reply(reply)
    let array = ["Because the candidate had switched his party allegiance immediately before the campaign, his former associates called him a traitor, and even his new allies considered him an opportunist.",
        "Bubble gum is not a topic usually treated seriously, so it is appropriate that this new book tracing the cultural history of bubble gum has a flippant tone."]
    for (let i = 0; i < 2; i++) {
        let prompt = `Increase the complexity of this sentence and make twice as longer: '${array[i]}' `
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0,
            max_tokens: 300,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["input:"],
        })
        console.log(response.data.choices[0].text)
    }
})