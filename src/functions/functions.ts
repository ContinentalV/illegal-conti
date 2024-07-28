import axios, {AxiosResponse} from "axios";



export const sendRequest = async (method: string, route: string, data?: any): Promise<any> => {
	let response: AxiosResponse;
	const baseRoute = process.env.CUSTOM_ENV === "production" ? "https://continentalv.fr/" :  "http://localhost:3000/api"
	const trueRoute = baseRoute + route;
	axios.defaults.withCredentials = true;
	const headers = {
		"Authorization": `Bearer ${process.env.TOKEN}`, // Assurez-vous que BOT_TOKEN est défini dans vos variables d'environnement
	};

	const config = {
		headers: headers,
		data: data ? data : undefined,
	};

	try {
		switch (method.toLowerCase()) {
		case "get":
			response = await axios.get(trueRoute, { headers: headers });

			break;
		case "post":
			response = await axios.post(trueRoute, data, { headers: headers });
			break;
		case "put":
			response = await axios.put(trueRoute, data, { headers: headers });
			break;
		case "delete":
			// Pour une requête DELETE, axios attend la configuration en deuxième argument
			response = await axios.delete(trueRoute, config);
			break;
		case "patch":
			response = await axios.patch(trueRoute, data, { headers: headers });
			break;
		default:
			throw new Error("Invalid HTTP method");
		}

		return response;
	}
	catch (error) {

		throw error;
	}
};
export const jsonFetchPlayers = async (): Promise<any> => {
	const response = await axios.get(process.env.FIVEM_URL!, {
		headers: {
			'Host': 'servers-frontend.fivem.net',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
			'Accept': 'application/json, text/plain, */*',
			'Origin': 'https://servers.fivem.net/',
			'DNT': '1',
			'Connection': 'keep-alive',
			'Alt-Used': 'servers-frontend.fivem.net',
			'Sec-Fetch-Dest': 'Document',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'none',
			'Pragma': 'no-cache',
			'Upgrade-Insecure-Requests': '1',
			'Cache-Control': 'no-cache',
			'TE': 'trailers'
		}
	})
	return  response.data.Data.clients;
}
export function getEmbedCharacterCount(embed:any): number {
	let characterCount = 0;

	// Compter les caractères dans le titre
	if (embed.title) {
		characterCount += embed.title.length;
	}

	// Compter les caractères dans la description
	if (embed.description) {
		characterCount += embed.description.length;
	}

	// Compter les caractères dans les champs
	if (embed.fields) {
		for (const field of embed.fields) {
			if (field.name) {
				characterCount += field.name.length;
			}
			if (field.value) {
				characterCount += field.value.length;
			}
		}
	}

	return characterCount;
}
export const jsonData = async () => {

	try {
		const response = await axios(process.env.FIVEM_URL!, {		headers: {
				'Host': 'servers-frontend.fivem.net',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
				'Accept': 'application/json, text/plain, */*',
				'Origin': 'https://servers.fivem.net/',
				'DNT': '1',
				'Connection': 'keep-alive',
				'Alt-Used': 'servers-frontend.fivem.net',
				'Sec-Fetch-Dest': 'Document',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'none',
				'Pragma': 'no-cache',
				'Upgrade-Insecure-Requests': '1',
				'Cache-Control': 'no-cache',
				'TE': 'trailers'
			}
		})

		return {data: response.data.Data.players, playerCount: response.data.Data.clients}
	} catch (e) {
		console.log(e)
	}

}


