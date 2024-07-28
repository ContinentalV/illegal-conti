import {
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder

} from 'discord.js';



export async function handleAnnouncementButton(interaction: ButtonInteraction) {

    const modal = new ModalBuilder()
        .setCustomId('announceModal')
        .setTitle('Créer une Annonce');

    const announcementBody = new TextInputBuilder()
        .setCustomId('announcementBody')
        .setLabel("Quel est le message de votre annonce ?")
        .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(announcementBody);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
}

export async function handleProcessingRemarque(interaction: ButtonInteraction) {
    const customId = interaction.customId;

    const [_, remarqueChoice, groupeChannelId] = customId.split('_');
    const msgId = interaction.message.id;

    const msg = await interaction.channel?.messages.fetch(msgId);

    if (msg && msg.embeds.length > 0) {

        const originalEmbed = msg.embeds[0];
        const newEmbed = new EmbedBuilder(originalEmbed.toJSON());  // Crée un nouvel EmbedBuilder à partir de l'embed original

        const emoVerified = `<a:checked:1266866702327480435>`;
        newEmbed.setTitle(`${emoVerified} ${originalEmbed.title} ${emoVerified}`); // Modifie le titre avec l'emoji vérifié
        newEmbed.setColor('#000000');
        newEmbed.setFooter({ text: `${originalEmbed?.footer ? originalEmbed?.footer.text : ""}  - Remarque vérifiée par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
        const buttonRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('processing')
                    .setLabel('Vérifier')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true) // Désactive le bouton
            );


        await msg.edit({ embeds: [newEmbed], components: [buttonRow] });
        if (msg.thread) {
            console.log(`État du Thread: ${msg.thread.archived ? 'Archivé' : 'Actif'}`);
            console.log(`Thread Verrouillé: ${msg.thread.locked ? 'Oui' : 'Non'}`);


            await msg.thread.setLocked(true); // Optionnel, pour verrouiller le thread
            await interaction.reply({ content: 'Remarque vérifiée avec succès !', ephemeral: true });

        }
    }
}







