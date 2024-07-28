import Bot from "../core/client";
import { Awaitable, ClientEvents, GuildMember } from "discord.js";
// TODO Verifier si on utilise bien les export comme guildMemberUpdate
// Define an interface for EventOptions
export interface EventOptions<K extends keyof ClientEvents> {
    event: K;
    once?: boolean; // Boolean to specify if the event should be executed only once
    listener: (client: Bot, ...args: ClientEvents[K]) => Awaitable<any>;
}

// Event handler pour guildMemberAdd


// Event handler pour messageCreate
export const messageCreate: EventOptions<"messageCreate"> = {
	event: "messageCreate",
	listener: (client: Bot, ...args: ClientEvents["messageCreate"]) => {
		// Votre logique de gestion pour l'événement messageCreate
	},
};
export  const guildCreate: EventOptions<"guildCreate"> = {
	event: "guildCreate",
	listener: (client: Bot, ...args: ClientEvents["guildCreate"]) => {

	},
};

export  const guildMemberAdd: EventOptions<"guildMemberAdd"> = {
	event: "guildMemberAdd",
	listener: (client: Bot, ...args: ClientEvents["guildMemberAdd"]) => {

	},
};
export  const messageUpdate: EventOptions<"messageUpdate"> = {
	event: "messageUpdate",
	listener: (client: Bot, ...args: ClientEvents["messageUpdate"]) => {

	},
};

export  const messageDelete: EventOptions<"messageDelete"> = {
	event: "messageDelete",
	listener: (client: Bot, ...args: ClientEvents["messageDelete"]) => {

	},
};

export  const channelCreate: EventOptions<"channelCreate"> = {
	event: "channelCreate",
	listener: (client: Bot, ...args: ClientEvents["channelCreate"]) => {

	},
};
export  const channelDelete: EventOptions<"channelDelete"> = {
	event: "channelDelete",
	listener: (client: Bot, ...args: ClientEvents["channelDelete"]) => {

	},
};