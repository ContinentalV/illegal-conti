
import {
    ModalSubmitInteraction,
    TextChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder
} from 'discord.js';
import { config } from "../config";
import {data} from "../commands/staff/remarque";

export async function handleAnnouncementModalSubmit(interaction: ModalSubmitInteraction) {
    const announcementBody = interaction.fields.getTextInputValue('announcementBody');
    const channel = interaction.client.channels.cache.get(config.channels.annonce) as TextChannel;

    if (channel) {
        await channel.send({content: "@everyone", embeds: [{description: announcementBody, color: 0x00ff00}]});
        await interaction.reply({ content: 'Annonce envoyée avec succès !' + ` <#${channel.id}>`, ephemeral: true });
    } else {
        await interaction.reply({ content: 'Le canal spécifié est introuvable.', ephemeral: true });
    }
}


export async function handleRemarqueModalSubmit(interaction: ModalSubmitInteraction) {
    const remarqueBody = interaction.fields.getTextInputValue('remarqueBody');
    const customId = interaction.customId;
    const channel = interaction.client.channels.cache.get(config.channels.remarque) as TextChannel;

    // Extraire le choix (positif/négatif) et l'ID du canal depuis le customId
    const [_, remarqueChoice, groupeChannelId] = customId.split('_');
    const groupeChannel = interaction.client.channels.cache.get(groupeChannelId) as TextChannel;


    const buttonRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('processing')
                .setLabel('Verifier')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false) // Désactive le bouton
        );

    // Déterminer la couleur de l'embed en fonction du choix
    const embedColor = remarqueChoice === 'positif' ? 0x00ff00 : 0xff0000;

    if (channel) {
       const Msg =  await channel.send({
            content: "@everyone",
           components: [buttonRow],
            embeds: [{
                title: `Remarque ${remarqueChoice}`,
                description: remarqueBody,
                color: embedColor,
                fields: [
                    { name: 'Groupe concerner : ', value: `<#${groupeChannel.id}>` }
                ],
                footer: { text: `Remarque envoyée par ${interaction.user.tag}`, icon_url: interaction.user.displayAvatarURL() }
            }]
        });
       const threadMessage = await channel.messages.fetch(Msg.id)
        const thread = await threadMessage.startThread({
            name: 'Details remarque',
            autoArchiveDuration: 1440, // Durée d'archivage automatique en minutes (1440 minutes = 24 heures)
            reason: 'Creation d\'un thread pour les details de la remarque , les screenshots et autres preuves pour permettre au gérant de gerer la remarque.'
        });
       await thread.send({content: `Veuillez envoyer des screenshots ou d'autres preuves pour cette remarque. Ou plus de details.\n\n > <@&${config.roles.gerant}> Veuillez  indiquer les actions entreprise par rapport a cette remarque (exemple: Avertissement, dissolution felicitation etc... ).`});
        await interaction.reply({ content: 'Remarque envoyée avec succès !' + ` <#${channel.id}>`, ephemeral: true });


    } else {
        await interaction.reply({ content: 'Le canal spécifié est introuvable.', ephemeral: true });
    }
}