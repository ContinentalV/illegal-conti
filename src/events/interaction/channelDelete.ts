import { ChannelType, EmbedBuilder, TextChannel, User, AuditLogEvent } from "discord.js";
import { EventOptions } from "../../types";
import Bot from "../../core/client";
import { config } from "../../config";

export default {
    event: "channelDelete",
    listener: async (client: Bot, channel) => {
        console.log("channelDelete event triggered"); // Log pour vérifier si l'événement est déclenché

        const logChannelId = config.channels.logsChannel; // Remplacez par l'ID de votre canal de log
        const logChannel = client.channels.cache.get(logChannelId) as TextChannel;

        if (!logChannel) {
            console.error("Log channel not found"); // Log pour vérifier si le canal de log est trouvé
            return;
        }

        // Vérifiez si le canal est un canal de guilde
        if (channel.type === ChannelType.DM) {
            console.error("Channel is not a guild channel");
            return;
        }

        // Récupérer les journaux d'audit pour trouver qui a supprimé le canal
        const auditLogs = await (channel as TextChannel).guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete,
            limit: 1
        });

        const deleteLog = auditLogs.entries.first();
        const executor = deleteLog?.executor as User;

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Channel Supprimé")
            .setDescription(`Canal supprimé par ${executor?.tag || "Inconnu"} - <@${executor?.id || "Inconnu"}>\nNom du canal: ${(channel as TextChannel).name}`)
            .addFields(
                { name: 'Type de canal', value: `${channel.type === ChannelType.GuildText ? `\`\`\`Texte\`\`\` ` : `\`\`\`Vocal\`\`\``}`, inline: true },
                { name: 'ID du canal', value: `\`\`\`${channel.id}\`\`\``, inline: true }
            )
            .setTimestamp(new Date());

        await logChannel.send({ embeds: [embed] });
    },
} satisfies EventOptions<"channelDelete">;