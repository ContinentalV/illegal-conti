import { EventOptions } from "../../types";
import { EmbedBuilder, GuildMember, PermissionsBitField, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from "discord.js";
import chalk from "chalk";
import Bot from "../../core/client";
import { config } from "../../config";
import { jsonData } from "../../functions/functions";

export let globalData: any = null;
let panelMessage: Message | null = null;

async function clearChannel(channel: TextChannel) {
    const messages = await channel.messages.fetch();
    await channel.bulkDelete(messages);
}

async function updatePanelMessage(client: Bot) {
    try {
        const channels = await client.guilds.cache.get(config.serverID)?.channels.fetch();
        // @ts-ignore
        if (!channels || channels.length === 0) return;
        const filterGreen = channels.filter((c: any) => c.name.includes("🟢")).map((c: any) => c);
        const filterOrange = channels.filter((c: any) => c.name.includes("🟠")).map((c: any) => c);
        let leadCoLead: any = [];
        for (const channel of filterGreen) {
            const members = channel.members.filter((member: GuildMember) =>
                channel.permissionsFor(member).has(PermissionsBitField.Flags.SendMessages));
            members.forEach((member: any) => {
                member.roles.cache.forEach((role: any) => {
                    if ((role.id === config.roles.Lead || role.id === config.roles.CoLead)) {
                        leadCoLead.push({ member: member, channel: channel, role: role });
                    }
                });
            });
        }

        for (const channel of filterOrange) {
            const members = channel.members.filter((member: GuildMember) =>
                channel.permissionsFor(member).has(PermissionsBitField.Flags.SendMessages));
            members.forEach((member: any) => {
                member.roles.cache.forEach((role: any) => {
                    if ((role.id === config.roles.Lead || role.id === config.roles.CoLead)) {
                        leadCoLead.push({ member: member, channel: channel, role: role });
                    }
                });
            });
        }

        const allPlayer = await jsonData();

        const JsonLinkLead = leadCoLead.map((lead: any) => {
            try {
                if (!allPlayer) return;
                const target = allPlayer.data.find((player: any) => player.identifiers.includes(`discord:${lead.member.id}`));
                if (!target) return { message: `offline`, channelId: lead.channel.id, channelName: lead.channel.name, role: lead.role.id, member: lead.member, memberId: lead.member.id };
                return { idIG: target.id, steamName: target.name, message: "online", channelId: lead.channel.id, channelName: lead.channel.name, role: lead.role.id, member: lead.member, memberId: lead.member.id };
            } catch (e) {
                console.log(e);
                throw e;
            }
        });

        // Regrouper les données par canal et compter les membres connectés
        const groupedData = JsonLinkLead.reduce((acc: any, curr: any) => {
            if (!acc[curr.channelId]) {
                acc[curr.channelId] = { channelName: curr.channelName, members: [], onlineCount: 0 };
            }
            if (curr.message === "online") {
                acc[curr.channelId].onlineCount++;
            }
            acc[curr.channelId].members.push(curr);
            return acc;
        }, {});

        // Trier les groupes par nombre de membres connectés
        const sortedGroups = Object.values(groupedData).sort((a: any, b: any) => b.onlineCount - a.onlineCount);

        // Créer les champs pour l'embed
        const fields = sortedGroups.map((group: any) => {
            const membersInfo = group.members.map((m: any) => {
                if (m.message === "offline") {
                    return `
> \`\`❌❌❌\`\`            
> <@&${m.role}>
> ${m.member}`;
                } else {
                    return `
> \`\`✅✅✅\`\`               
> <@&${m.role}>
> ${m.member}       
> IG: \`\`${m.idIG}\`\`   
> \`\`${m.steamName}\`\`  
            `;
                }
            }).join("");

            return {
                name: `${group.channelName.replace("🟢", "").replace("🟠", "").toUpperCase().replace("┊", "")} `,
                value: `
<#${group.members[0].channelId}>
${membersInfo}
\u200b
          `,
                inline: true
            };
        });

        //@ts-ignore
        const since = client ? new Date(client.readyTimestamp).toLocaleTimeString() : "N/A";
        const embed = new EmbedBuilder()
            .setTimestamp()
            .setTitle("Panel de gestion Illegal")
            .setDescription(`
            **Derniere mise à jour: \`\`${new Date().toLocaleTimeString()}\`\`**
            **Demarrer depuis: \`\`${since}\`\`**
            ==========================
            `)
            .setColor("Random")
            .addFields(fields);
        const buttonRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('announcement')
                    .setLabel('Annonce')
                    .setEmoji('📢')
                    .setStyle(ButtonStyle.Success),
            );

        const channel = client.channels.cache.get(config.channels.panelGestion) as TextChannel;

        if (panelMessage) {
            await panelMessage.edit({ embeds: [embed], components: [buttonRow] });
        } else {
            panelMessage = await channel.send({ embeds: [embed], components: [buttonRow] });
        }

    } catch (err) {
        console.error(err);
    }
}

export default {
    event: "ready",
    listener: async (client: Bot) => {
        console.log(chalk.yellowBright(`${client.user?.tag} is ready!`));
        await client.application?.commands.set(client.commands.map((command) => command.data));

        const channel = client.channels.cache.get(config.channels.panelGestion) as TextChannel;
        if (channel) {
            await clearChannel(channel);
        }

        await updatePanelMessage(client);
        setInterval(() => updatePanelMessage(client), 180000); // Mettre à jour toutes les 3 minutes
    },
} satisfies EventOptions<"ready">;
