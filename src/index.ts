// Import Bot class from client module
import Bot from "./core/client";
import mongoose from "mongoose";
import { config } from "dotenv";
import { GatewayIntentBits, Partials } from "discord.js";


// Initialize configuration with debug mode
config({ debug: true });

(async function() {
	// Create a new instance of Bot with specific intents and partials
	const bot = new Bot({
		intents: [GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.GuildMessageReactions,

		],
		partials: [
			Partials.Channel,
			Partials.Message,
			Partials.Reaction,
			Partials.User,
			Partials.ThreadMember,
			Partials.GuildScheduledEvent,
			Partials.GuildMember,

		],
	});


	/*
await mongoose.connect(process.env.DATABASE_URI!, {}).then(() => {
	console.log('mongoose', 'Connected to database ✅✅', true)
}).catch((err) => {
	console.log('mongoose', 'Error while connecting to database ❌❌', false)
	console.log(err)
})

*/
	// Start the bot
	await bot.start();

})();
