import Table from 'cli-table3';
import chalk from 'chalk';
import {Guild} from "discord.js";

class CacheManager {
    private staffData: { admin: number, modo: number, support: number } = { admin: 0, modo: 0, support: 0 };
    private playerCount: number = 0;
    private dataStaffDyn: { currentPlayer: number, currentStaff: number, currentModo: number, currentAdmin: number, currentSupport: number, currentStaffInCity: number,  listModo:string[], listAdmin:string[], listSupport:string[], modoWorking: string[], adminWorking: string[], supportWorking: string[]  } = { currentPlayer: 0, currentStaff: 0, currentModo: 0, currentAdmin: 0, currentSupport: 0, currentStaffInCity: 0, listModo:[], listAdmin:[], listSupport:[],  modoWorking:[], adminWorking:[], supportWorking:[]   };
    private guildLogs: Guild | null = null;
    private guildStaff: Guild | null = null;
    private logsReceived: number = 0;
    private logsMissed: number = 0;
    private channelListenCount: number = 0;

    getStaffData() {
        return this.dataStaffDyn;
    }
    // Méthode pour mettre à jour les données d'alerte
    updateStaffData(bodyDataStaff: { currentPlayer: number, currentStaff: number, currentModo: number, currentAdmin: number, currentSupport: number, currentStaffInCity: number, listModo:string[], listAdmin:string[], listSupport:string[], modoWorking: string[], adminWorking: string[], supportWorking: string[]}) {
        this.dataStaffDyn = { ...bodyDataStaff };
    }
    displayCache() {
        const table = new Table({
            head: [chalk.cyan('Property'), chalk.cyan('Value')],
            colWidths: [20, 20]
        });
        for (const [key, value] of Object.entries(this.dataStaffDyn)) {
            if (Array.isArray(value)) {
                table.push([chalk.green(key), value.join(', ')]);
            } else {
                table.push([chalk.green(key), value.toString()]);
            }
        }
        console.log(table.toString());
    }

    // Méthode pour obtenir le nombre de joueurs
    getPlayerCount() {
        return this.playerCount;
    }
    // Méthode pour mettre à jour le nombre de joueurs
    updatePlayerCount(count: number) {
        this.playerCount = count;
    }

    // Méthode pour obtenir guildLogs
    getGuildLogs() {
        return this.guildLogs;
    }

    // Méthode pour mettre à jour guildLogs
    updateGuildLogs(guild: Guild) {
        this.guildLogs = guild;
    }

    // Méthode pour obtenir guildStaff
    getGuildStaff() {
        return this.guildStaff;
    }

    // Méthode pour mettre à jour guildStaff
    updateGuildStaff(guild: Guild) {
        this.guildStaff = guild;
    }

    getLogsReceived() {
        return this.logsReceived;
    }
    updateLogsReceived(count: number) {
        this.logsReceived += count ;
    }

getLogsMissed() {
        return this.logsMissed;
    }
    updateLogsMissed(count: number) {
        this.logsMissed += count ;
    }

    getChannelListenCount() {
        return this.channelListenCount;

    }
    updateChannelListenCount(count: number) {
        this.channelListenCount += count ;
    }


}




// Créer une instance de CacheManager
export const cacheManager = new CacheManager();