import {EmbedBuilder, Message, PartialMessage, TextChannel} from "discord.js";
import { EventOptions } from "../../types";
import Bot from "../../core/client";
import {config} from "../../config";

export default {
    event: "messageUpdate",
    listener: async (client: Bot, oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
        if (oldMessage.partial) {
            try {
                await oldMessage.fetch();
            } catch (error) {
                console.error("Failed to fetch the old message:", error);
                return;
            }
        }

        if (newMessage.partial) {
            try {
                await newMessage.fetch();
            } catch (error) {
                console.error("Failed to fetch the new message:", error);
                return;
            }
        }

        if (oldMessage.content === newMessage.content) return; // Ignorer si le contenu n'a pas changé
        const logChannelId = config.channels.logsMessage
        const logChannel = client.channels.cache.get(logChannelId) as TextChannel;
        const channelFrom = oldMessage.channel;
        const author = oldMessage.author;
        const embed = new EmbedBuilder()
            .setTitle("Message modifié")
            . setTimestamp()
            .setFooter({text: `Gestion Illegal Watching`, iconURL: client.user?.displayAvatarURL()})
            .setColor('#ff7f00')
            .setDescription(`Message modifié par ${oldMessage.author?.tag} - ${oldMessage.author?.id} - <@${oldMessage.author?.id}>`)
            .addFields(
                { name: 'Ancien message', value: ` \`\`${oldMessage}\`\`  `, inline: true },
                                { name: '\u200b', value: `⏩⏭️`, inline: true },
                             { name: 'Nouveau message', value: `  \`\`${newMessage}\`\` `, inline: true },
                             { name: 'Channel', value: `${channelFrom}` },
                            { name: 'Auteur', value: `${author}` , inline: true },
            )
        await logChannel.send({ embeds: [embed] });
    },
} satisfies EventOptions<"messageUpdate">;
