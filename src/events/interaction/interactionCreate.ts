import Bot from "../../core/client";
import { CommandOptions, EventOptions } from "../../types";
import {
	ApplicationCommandType,
	AutocompleteInteraction,
	Collection,
	CommandInteraction,
	CommandInteractionOptionResolver,
	inlineCode,
	InteractionType, ModalSubmitInteraction,
} from "discord.js";
import {

	handleAnnouncementButton, handleProcessingRemarque,


} from "../../utils/buttonsActions";
import {handleAnnouncementModalSubmit, handleRemarqueModalSubmit} from "../../utils/modalsActions";


type CommandStats = {
    command: string;
    totalTime: number;
    count: number;
    errorCount: number;
};

// Typage pour les informations de la guilde, y compris les statistiques des commandes
type GuildStats = {
    id: string;
    name: string;
    commands: Map<string, CommandStats>;
};

// Map globale pour stocker les statistiques par guilde
const guildStatsMap: Map<string, GuildStats> = new Map();


const guildInfo: GuildStats[] = [];
export default {
	event: "interactionCreate",
	listener: async (client, interaction) => {
		const startTime = process.hrtime.bigint();
		const guildId = interaction.guild?.id || "DM";
		const guildName = interaction.guild?.name || "Direct Message";
		guildInfo.push({ id: guildId, name: guildName, commands: new Map() });

		if (interaction.type === InteractionType.ApplicationCommand) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				if (interaction.isContextMenuCommand()) {
					if (interaction.commandType === ApplicationCommandType.User) {
						// Handle user-based context menu command
						await command.execute(client, interaction,  interaction.options as CommandInteractionOptionResolver);
					}
				}else if (interaction.isCommand()) {
					// Slash command interaction
					const cooldown = await handleCooldown(client, interaction, command);
					if (!cooldown) return;
					await command.execute(client, interaction, interaction.options as CommandInteractionOptionResolver);
				}

				//const cooldown = await handleCooldown(client, interaction, command);
				//if (!cooldown) return;
				//await command.execute(client, interaction, interaction.options as CommandInteractionOptionResolver);
				const endTime = process.hrtime.bigint();
				const respTime = Number(endTime - startTime) / 1_000_000;
				updateGuildCommandStats(guildId, guildName, interaction.commandName, respTime, false);

			}
			catch (err){
				console.error(`Error executing command: ${err}`);
				updateGuildCommandStats(guildId, guildName, interaction.commandName, 0, true);
				return interaction.reply({
					content: "Une erreur s'est produite lors de l'exécution de cette commande.",
					ephemeral: true,
				});
			}
		}
		else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			const command = client.commands.get(interaction.commandName) as CommandOptions & {
                autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
            };

			if (!command) {
				console.error("Pas de commande correspondante.");
				return;
			}

			// Maintenant TypeScript sait que `command.autocomplete` existe et est une fonction.
			try {
				await command.autocomplete(interaction);
			}
			catch (e) {
				console.error(`Erreur d'autocomplétion: ${e}`);
			}
		}
		if (interaction.isButton()) {
			switch (interaction.customId) {
				case 'announcement':
					console.log("Button handled announcement");
					await handleAnnouncementButton(interaction);
					break;
				case 'processing':
					console.log("Button handled process");
					await handleProcessingRemarque(interaction);
					break;


				default:
					console.log("Button not handled");
			}
		} else if (interaction.type === InteractionType.ModalSubmit) {
			const customId = interaction.customId;

			if (customId.startsWith('announceModal')) {
				await handleAnnouncementModalSubmit(interaction as ModalSubmitInteraction);
			} else if (customId.startsWith('remarqueModal')) {
				await handleRemarqueModalSubmit(interaction as ModalSubmitInteraction);
			} else {
				console.log("Modal not handled");
			}
		}

	},
} satisfies EventOptions<"interactionCreate">;

async function handleCooldown(client: Bot, interaction: CommandInteraction, command: CommandOptions) {
	if (!command.cooldown) return;
	if (!client.cooldowns.has(command.data.name)) {
		client.cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = client.cooldowns.get(command.data.name);

	if (timestamps?.has(interaction.user.id)) {
		const expirationTime = Number(timestamps?.get(interaction.user.id)) + command.cooldown;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1_000);
			const nowTimestamp = Math.round(now / 1_000);
			const timeLeft = expiredTimestamp - nowTimestamp;
			await interaction.reply({
				content: `Please wait ${inlineCode(timeLeft.toString())} more second(s) before reusing the ${inlineCode(command.data.name)} command.`,
				ephemeral: true,
			});
			return false;
		}
	}

	timestamps?.set(interaction.user.id, now);
	setTimeout(() => timestamps?.delete(interaction.user.id), command.cooldown);
	return true;
}

function updateGuildCommandStats(guildId: string, guildName: string, commandName: string, responseTime: number, isError: boolean) {
	// Obtenir les statistiques de la guilde, ou en créer de nouvelles si elles n'existent pas
	let guildStats = guildStatsMap.get(guildId);
	if (!guildStats) {
		guildStats = { id: guildId, name: guildName, commands: new Map() };
		guildStatsMap.set(guildId, guildStats);
	}

	// Obtenir les statistiques de la commande, ou en créer de nouvelles si elles n'existent pas
	let commandStats = guildStats.commands.get(commandName);
	if (!commandStats) {
		commandStats = { command: commandName, totalTime: 0, count: 0, errorCount: 0 };
		guildStats.commands.set(commandName, commandStats);
	}

	// Mettre à jour les statistiques
	commandStats.count++;
	commandStats.totalTime += responseTime;
	if (isError) {
		commandStats.errorCount++;
	}

	// Pas besoin de 'set' car les objets sont modifiés par référence
}

export function getGuildCommandStats() {
	const guildsStatsArray: GuildStats[] = [];

	guildStatsMap.forEach(guildStats => {
		// Transformer la map des commandes en array
		const commandsArray: CommandStats[] = [...guildStats.commands.values()];


		guildsStatsArray.push({
			id: guildStats.id,
			name: guildStats.name,
			// @ts-ignore
			commands: commandsArray, // Ceci est un tableau d'objets de statistiques de commandes

		});
	});

	return guildsStatsArray;
}