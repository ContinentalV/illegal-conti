import { Message, PartialMessage, TextChannel, EmbedBuilder, User, AuditLogEvent } from "discord.js";
import { EventOptions } from "../../types";
import Bot from "../../core/client";
import { config } from "../../config";
// TODO Gere le cas si c un message embeds
export default {
	event: "messageDelete",
	listener: async (client: Bot, message: Message | PartialMessage) => {
		console.log("messageDelete event triggered"); // Log pour vérifier si l'événement est déclenché
		if(message.embeds.length > 0) return; // Ignorer les messages avec des embeds
		if (message.partial) {
			try {
				await message.fetch();
				console.log("Fetched partial message"); // Log pour vérifier si le message partiel est récupéré
			} catch (error) {
				console.error("Failed to fetch the deleted message:", error);
				return;
			}
		}

		const logChannelId = config.channels.logsMessage; // Remplacez par l'ID de votre canal de log
		const logChannel = client.channels.cache.get(logChannelId) as TextChannel;

		if (!logChannel) {
			console.error("Log channel not found"); // Log pour vérifier si le canal de log est trouvé
			return;
		}

		// Récupérer les journaux d'audit pour trouver qui a supprimé le message
		const auditLogs = await message.guild?.fetchAuditLogs({
			type: AuditLogEvent.MessageDelete,
			limit: 1
		});

		const deleteLog = auditLogs?.entries.first();
		const executor = deleteLog?.executor as User;

		const embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle("Message Supprimé")
			.setDescription(`Message supprimé par ${executor?.tag || "Inconnu"} - <@${executor?.id}>\nAuteur du message: ${message.author?.tag || "Inconnu"} - <@${message.author?.id || "Inconnu"}>`)
			.addFields(
				{ name: 'Ancien message', value: `\`\`${message.content}\`\``, inline: false },
				{ name: 'Channel', value: `${message.channel}`, inline: true }
			)
			.setTimestamp(new Date());

		await logChannel.send({ embeds: [embed] });
	},
} satisfies EventOptions<"messageDelete">;
