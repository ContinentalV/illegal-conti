import {ApplicationCommandType, ContextMenuCommandBuilder} from "discord.js";
import Bot from "../../core/client";
import { CommandOptions } from "../../types";
import {EmbedFactory} from "../../classes/EmbedFactory";

export default {
    data: new ContextMenuCommandBuilder()
        .setName('pds-start')
        .setType(ApplicationCommandType.User), // Explicitly set as a User context menu

    category: "admin",
    cooldown: 5000,
    execute: async (client: Bot, interaction) => {
        const guild = interaction.guild;
        const member = interaction.member;
        let targetMember;

        if (!guild || !member) {
            await interaction.reply({ content: "Erreur : Guilde / Membre introuvable.", ephemeral: true });
            return;
        }
        if ('targetId' in interaction) {
            targetMember = await guild.members.fetch(interaction.targetId);
        }
        if (!targetMember) {
            await interaction.reply({ content: "Erreur : Membre ciblé introuvable.", ephemeral: true });
            return;
        }

        // TODO: me suis arreter ici
        //Logique PDS ICI  - Vue que ici c le responsable qui démarre la PDS, on pêut peut overwrite les verif de slot. (pour la version staff, mettre en place les verif)
        //@ts-ignore
        const X = EmbedFactory.serviceStartByResponsable(interaction.targetId, member.id);




        await interaction.reply({ embeds: [X], content: `Le @Responsable ${member} vient de terminer  la PDS du : \`\`${targetMember.roles.highest.name}: ${targetMember.user.username} \`\` ${targetMember} a :  \`\`${Date.now().toLocaleString()}  \`\`  .`});
    },

} satisfies CommandOptions;