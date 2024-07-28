import {cacheManager} from "../classes/CacheManager";

import {EmbedBuilder} from "discord.js";






export const alertReinforcement = () => {
    const cacheData = cacheManager.getStaffData()

const alertEmbed = new EmbedBuilder()
    .setTitle('<a:getsu4:1065114682463096925> [**ALERT**] : **Renforts demandés** <a:getsu4:1065114682463096925> ')
    .setTimestamp()
    .setFooter({text: 'Request By : Responsable Staff'})
    .setColor("Red")
    .setImage("https://media1.tenor.com/m/UxUCSnDahR0AAAAC/angry-rage.gif")
    .setDescription(`
**<a:getsu3:1065114685021634600>  🤷‍Nombre de joueur:  ->  ${cacheData.currentPlayer}**
**<a:getsu3:1065114685021634600>  👮  Nombre de staff en service: -> ${cacheData.currentStaff}**
**<a:getsu3:1065114685021634600>  🕹️ Staff en ville: -> ${cacheData.currentStaffInCity}**    
═════════ ══════════════════ 
**<a:getsu3:1065114685021634600><@&1173726153060659256>: -> ${cacheData.currentSupport} en service**
**<a:getsu3:1065114685021634600><@&1173726153060659257>: -> ${cacheData.currentModo} en service**
**<a:getsu3:1065114685021634600><@&1173726153060659258>: -> ${cacheData.currentAdmin} en service**
    `)
    .addFields(
        {name: 'Supports en service', value: `═════════\n${cacheData.supportWorking.map((staff) =>`\`\`\` ${staff} \`\`\``).join('\n')} `, inline: true},
        {name: 'Modos en service', value: `═════════ \n${cacheData.modoWorking.map((staff) =>`\`\`\` ${staff} \`\`\``).join('\n')} `, inline: true},
        {name: 'Admins en service', value: `═════════ \n${cacheData.adminWorking.map((staff) =>`\`\`\` ${staff} \`\`\``).join('\n')} `, inline: true},
        {name: '═════════ ═════════ ══════════════════ ', value: `\n`, inline: false},
        {name: 'Supports en Ville', value: `═════════ \n ${cacheData.listSupport.join("\n ") || "Aucun"}`, inline: true},
        {name: 'Modos en Ville', value: `═════════ \n ${cacheData.listModo.join("") || "Aucun"}`, inline: true},
        {name: 'Admins en Ville', value: `═════════ \n ${cacheData.listAdmin.join("") || "Aucun"}`, inline: true},
    )

    return alertEmbed
}
