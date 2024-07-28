import { ChannelType, EmbedBuilder, TextChannel, User, AuditLogEvent } from "discord.js";
import { EventOptions } from "../../types";
import Bot from "../../core/client";
import { config } from "../../config";

export default {
    event: "channelCreate",
    listener: async (client: Bot, channel ) => {
        console.log("channelCreate event triggered"); // Log pour vérifier si l'événement est déclenché

        const logChannelId = config.channels.logsChannel; // Remplacez par l'ID de votre canal de log
        const logChannel = client.channels.cache.get(logChannelId) as TextChannel;

        if (!logChannel) {
            console.error("Log channel not found"); // Log pour vérifier si le canal de log est trouvé
            return;
        }

        // Récupérer les journaux d'audit pour trouver qui a créé le canal
        const auditLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 1
        });

        const createLog = auditLogs.entries.first();
        const executor = createLog?.executor as User;

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Channel Créé")
            .setDescription(`> Canal créé par ${executor?.tag || "Inconnu"} - <@${executor?.id || "Inconnu"}>\n\n> Nom du canal: <#${channel.id}>`)
            .addFields(
                { name: 'Type de canal', value: `${channel.type === ChannelType.GuildText ? `\`\`\`Texte\`\`\` ` : `\`\`\`Vocal\`\`\``}`, inline: true },
                { name: 'ID du canal', value: `\`\`\`${channel.id}\`\`\``, inline: true }
            )
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    },
} satisfies EventOptions<"channelCreate">;
