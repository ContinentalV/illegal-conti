import { Message } from "discord.js";
import { EventOptions } from "../../types";
import Bot from "../../core/client";
import {findUserWithRetry} from "../../functions/functions";
import staff from "../../models/staff";
import axios from "axios";
import {cacheManager} from "../../classes/CacheManager";

export default {
    event: "messageCreate",
    listener: async (client: Bot, ...args: any[]) => {

        const message = args[0] as Message;
        let idMsgDescFail=[]
        let channelListenCount = 0;

        const handleLogsEntry = async (id: string, catSuffix:string) => {
            if(message.content) return;

            channelListenCount++;

            if(message.channel.id === id){
                if(message.embeds[0].description === undefined || message.embeds[0].description === null) {
                    idMsgDescFail.push(message.id)
                    return;
                }
                console.log(message.id)
                console.log(message.url)
                const msg = message.embeds[0]?.description;

                    const cat = msg?.split(" ")[0].split("[")[1].replace(']', '');
                    const data = {
                        message: msg,
                        category: cat + " " + catSuffix,
                    }
                    const response = await axios.post("http://localhost:3000/api/v1/logs/create", data)
                    console.log(response.data)
                    cacheManager.updateLogsReceived(1)


            }


        }
        const handleLogsEntryNoEmbed = async(id:string, cat:string) => {
            channelListenCount++;
            if(message.channel.id === id){
                const msg = message.content;
                const data = {
                    message: msg,
                    category: cat,
                }
                const response = await axios.post("http://localhost:3000/api/v1/logs/create", data)
                console.log(response.data)
                cacheManager.updateLogsReceived(1)
            }
        }

const handleNumberOfListener = async() => {
    cacheManager.updateChannelListenCount(channelListenCount)
    await handleLogsEntry("1169140112488157205", "remove");
    await handleLogsEntry("1238049234268459008", "add");
    await handleLogsEntry("1238049157634199612", "received money");
    await handleLogsEntry("1238053345508462644", "give money");
    await handleLogsEntry("1238055076325490748", "give player to player");
    await handleLogsEntry("1238049362295259206", "drop recuperer");
    await handleLogsEntry("1238049027740930048", "drop");
    await handleLogsEntry("956602808805752892", "coffre propriete ");
    //await handleLogsEntry("640568968553168906", "ban-unban");
    await handleLogsEntryNoEmbed("640574144282361884", "kill");
    await handleLogsEntryNoEmbed("640573853621551145", "connexion");
    await handleLogsEntryNoEmbed("1169507848112308308", "traitement drogue");
    await handleLogsEntryNoEmbed("1106056564474916895", "depot banque");
    await handleLogsEntryNoEmbed("1106056613703471174", "retrait banque");
    await handleLogsEntryNoEmbed("1071643382415364197", "réa terminal");
    await handleLogsEntryNoEmbed("1086861578915287221", "immo forcing");
    await handleLogsEntryNoEmbed("1193456170883624980", "immo forcing");
    await handleLogsEntryNoEmbed("1072031656602509353", "jail");

if( cacheManager.getChannelListenCount() === 0 ){

    cacheManager.updateChannelListenCount(channelListenCount)

}


}

await handleNumberOfListener()










    },
} satisfies EventOptions<"messageCreate">;
