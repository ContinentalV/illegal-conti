import { EmbedBuilder } from "discord.js";
import {config} from "../config";
import {IPanelService, PanelStats} from "../types/interfaces";


export class EmbedFactory {
  static baseEmbed(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTimestamp();
  }

  static statsEmbed({ supportCount, modoCount, adminCount, playerCount, staffCityCount, staffServiceCount, listSupport, listModo, listAdmin, supportCityCount, adminCityCount, modoCityCount }: PanelStats): EmbedBuilder {

    return this.baseEmbed()
        .setTitle('Statistiques du Serveur')
        .setDescription(`
  
═════════ ═════════ ══════════════════           
 ######### \`\`Derniere mise a jour:\`\` \`\`${new Date().toLocaleTimeString()}\`\`
 ######### \`\`Bot démarré depuis:\`\` \`\`${process.uptime()} secondes\`\` 
 ######### \`\`Bot demarré le:\`\` \`\`${new Date(process.uptime()).toLocaleTimeString()}\`\`
═════════ ═════════ ══════════════════        
######### \`\`🤷‍♂️Citoyen IG:\`\`  \`\`${playerCount}\`\`
######### \`\`🚓Staff en ville:\`\`  \`\`${staffCityCount}\`\`
######### \`\`🚨Staff en service:\`\`  \`\`${staffServiceCount}\`\`
═════════ ═════════ ══════════════════      
\u200b        
> <@&${config.roles.support}>: \`\`${supportCount} en service\`\` 
> <@&${config.roles.modo}>: \`\`${modoCount} en service \`\` 
> <@&${config.roles.admin}>: \`\`${adminCount} en service \`\`  
═════════ ═════════ ══════════════════      
 `)
        .addFields(
            {name: 'Supports en service', value: `═════════\n ${listSupport.join("\n ") || "Aucun"}`, inline: true},
                        {name: 'Modos en service', value: `═════════ \n  ${listModo.join("") || "Aucun"}`, inline: true},
                        {name: 'Admins en service', value: `═════════ \n  ${listAdmin.join("") || "Aucun"}`, inline: true},
                        {name: '═════════ ═════════ ══════════════════ ', value: `\n`, inline: false},
                        {name: 'Supports en Ville', value: `═════════ \n  ${supportCityCount.join("\n ") || "Aucun"}`, inline: true},
                        {name: 'Modos en Ville', value: `═════════ \n  ${modoCityCount.join("") || "Aucun"}`, inline: true},
                        {name: 'Admins en Ville', value: `═════════ \n  ${adminCityCount.join("") || "Aucun"}`, inline: true},
                        {name: '═════════ ═════════ ══════════════════ ', value: `\n`, inline: false},
                        {name: '\u200b ', value: `
- 10 & 30 Joueurs: 
  - <@&${config.roles.support}>: 2
  - <@&${config.roles.modo}>/<@&${config.roles.admin}>:  \`\`1\`\` `, inline: true},
            {name: '\n', value: `- 30 & 50 Joueurs:
    - <@&${config.roles.support}>: \`\`3\`\`
    - <@&${config.roles.modo}> : \`\`2\`\`
    - <@&${config.roles.admin}>: \`\`2\`\``, inline: true},
            {name: '\n ', value: `- 50 & 90 Joueurs:
    - <@&${config.roles.support}>: \`\`5\`\`
    - <@&${config.roles.modo}>: \`\`3\`\`
    - <@&${config.roles.admin}>: \`\`3\`\``, inline: true},
            {name: '\n', value: `- 90 & 150 Joueurs:
    - <@&${config.roles.support}>: \`\`7\`\`
    - <@&${config.roles.modo}>: \`\`5\`\`
    - <@&${config.roles.admin}>: \`\`5\`\``, inline: true},
            {name: '\n', value: `- 150 Joueurs:
    - <@&${config.roles.support}>: unlimited    
                    `, inline: true},
            {name: '\n', value: `\n`, inline: true},

        )

        .setTimestamp();
  }

    static errorEmbed(message: string): EmbedBuilder {
        return this.baseEmbed()
            .setTitle('Erreur')
            .setDescription(message)
            .setColor('#ff0000'); // Red for error
    }

    static serviceStartByResponsable({name,nickname,start,end,timed, pdsStartByResp, pdsEndByResp, id}:IPanelService) {
        return this.baseEmbed()
            .setTitle(`Prise de service (By Responsable) ${!pdsStartByResp ? `` : `${pdsStartByResp}`} `)
            //.setDescription("")
            .setColor('#008dff'); // Red for error
    }
    static serviceEndByResponsable({name,nickname,start,end,timed, pdsStartByResp, pdsEndByResp, id}:IPanelService) {
        return this.baseEmbed()
            .setTitle(`Fin  de service (By Responsable) ${!pdsEndByResp  ? `` : `${pdsEndByResp}`} `)
            .setDescription("")
            .setColor('#02e70f'); // Red for error
    }

    static personalStatsEmbed(data:any) {
        // Configure your embed with the personal stats data:any
    }

    static announcementEmbed(title: string, message: string): EmbedBuilder {
        return this.baseEmbed()
            .setTitle(title)
            .setDescription(message)
            .setColor('#00ff00'); // Green for announcements
    }



    static remarkSanctionEmbed(data:any) {
        // Configure your embed with the remark/sanction data:any
    }

}