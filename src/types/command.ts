import Bot from "../core/client";
import {
    ApplicationCommandData,
    AutocompleteInteraction,
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver, ContextMenuCommandInteraction,
    Guild,
    GuildMember,
    User,
} from "discord.js";


// Define an interface for CommandOptions
export interface CommandOptions {
    data: ApplicationCommandData; // Utilisation du type générique pour couvrir tous les types de commandes
    category: string;
    cooldown?: number;
    execute: (client: Bot, interaction: CommandInteraction | ContextMenuCommandInteraction, args?: CommandInteractionOptionResolver) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
    user: User;
    guild: Guild;
}
