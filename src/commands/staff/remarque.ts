import { CommandOptions } from "../../types";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
export let data:any = [];

export default {
    data: {
        name: "remarque",
        description: "Déposer une remarque sur une organisation",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "remarque",
                description: "Entrez la remarque",
                required: true,
                choices: [
                    {
                        name: "positif",
                        value: "positif",
                    }
                    ,
                    {
                        name: "négatif",
                        value: "négatif",
                    }
            ],
            },
            {
                name: "groupe",
                description: "Sélectionnez le groupe",
                type: ApplicationCommandOptionType.Channel,
                required: true,

            }

            ]
    },
    category: "staff",
    cooldown: 5000,
    execute: async (client, interaction, args) => {
        if (!args) return;
        const remarqueChoice = args.getString('remarque');
        const groupeTarget = args.getChannel('groupe');
        if (!groupeTarget) return;
        if (!interaction) return;

        const modal = new ModalBuilder()
            .setCustomId(`remarqueModal_${remarqueChoice}_${groupeTarget.id}`)
            .setTitle('Créer une remarque');

        const remarqueBody = new TextInputBuilder()
            .setCustomId('remarqueBody')
            .setLabel("Indiquez votre remarque")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(remarqueBody);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    },
} satisfies CommandOptions;