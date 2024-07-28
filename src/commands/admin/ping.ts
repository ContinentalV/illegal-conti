import { CommandOptions } from "../../types";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

export default {
  data: {
    name: "ping",
    description: "Ping command",
  },
  category: "category",
  cooldown: 5000,
  execute: async (client, interaction, args) => {
    const start = Date.now();
    await interaction.reply({ content: "Calculating ping..." });
    const end = Date.now();
    const ping = end - start;

    await interaction.editReply({ content: `Pong! 🏓 Response time: ${ping}ms` });
  },
} satisfies CommandOptions;