import { Message } from "discord.js";
import { EventOptions } from "../../types";
import Bot from "../../core/client";





export default {
	event: "messageCreate",
	listener: async (client: Bot, ...args: any[]) => {
		const message = args[0] as Message;
		console.log(message.content);
	// I want log all modified messages & deleted messages with nice embed présentation in a specific channel










	},
} satisfies EventOptions<"messageCreate">;
