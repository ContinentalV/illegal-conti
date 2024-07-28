import { CommandOptions } from "../../types";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import {EmbedBuilder, TextChannel} from "discord.js";
import {config} from "../../config";

export default {
    data: {
        name: "gang-management",
        description: "Permet de traiter les différent statut des groups illegaux",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "message",
                description: "selectionne le message a gerer",
                required: true,

                choices: [
                    {
                        name: "Approuvé",
                        value: "approved",
                    },
                    {
                        name: "Refuser",
                        value: "denying",
                    },
                    {
                        name: "En traitement",
                        value: "pending",
                    },
                    {
                        name: "Prêt",
                        value: "ready",
                    },
                    {
                        name: "En cours",
                        value: "inprogress",
                    }

                ],

            },
            {
                type: ApplicationCommandOptionType.Channel,
                name: "channel",
                description: "Sélectionnez le channel associé",
                required: true
            }
        ]
    },
    category: "gerant",
    cooldown: 5000,
    execute: async (client, interaction, args) => {
        if(!args) return;
        const selectedMode: string | null = args.getString("message", true);
        const channelTarget = args.getChannel("channel", true);
        if(!channelTarget) return;
         let embed = new EmbedBuilder()
             .setFooter({text: `Message envoyé par ${interaction.user.username} `, iconURL: interaction.user.displayAvatarURL()})
             .setTimestamp()




       //Switch case pour les differents cas
        switch (selectedMode) {
            case "approved":
                const msg = config.messagePredefinis.messageApproved;
                embed.setTitle("Groupe approuvé")
                    .setDescription(msg)
                    .setColor("#34FA04")
                await (channelTarget as TextChannel).send({ embeds: [embed] });
                break;
            case "denying":
                const msg2 = config.messagePredefinis.messageDenied;
                embed.setTitle("Groupe refusé")
                    .setDescription(msg2)
                    .setColor("#FA0404")
                await (channelTarget as TextChannel).send({ embeds: [embed] });

                break;
            case "pending":
                const msg3 = config.messagePredefinis.messagePending;
                embed.setTitle("Groupe en attente")
                    .setDescription(msg3)
                    .setColor("#FAF904")

                await (channelTarget as TextChannel).send({ embeds: [embed] });

                break;
            case "ready":
                const msg4 = config.messagePredefinis.messageReady;
                embed.setTitle("Groupe prêt")
                    .setDescription(msg4)
                    .setColor("#04FAF9")
                await (channelTarget as TextChannel).send({ embeds: [embed] });

                break;
            case "inprogress":
                const msg5 = config.messagePredefinis.messageInProgress;
                embed.setTitle("Groupe en cours")
                    .setDescription(msg5)
                    .setColor("#F904FA")

                await (channelTarget as TextChannel).send({ embeds: [embed] });

                break;
            default:
                if(!interaction.channel) return;
                await interaction?.channel.send({ content: `Erreur : Message inconnu`});
                break;
        }

    await interaction.reply({ content: `Le message  ${selectedMode} a bien été envoyé: ${channelTarget.id}`, ephemeral: true });


    },
} satisfies CommandOptions;