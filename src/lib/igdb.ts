import "server-only" //Server only compoenet due to sensitive info

//JSON twtich return Format to easily define the data
type TwitchTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: "bearer";
};

//Variables
let cachedToken: string | null = null; //Store cached token(string only) into memeroy, assign null if not token
let cachedTokenExpiresAtMs = 0; //cahcedToken expire time 

//Error check .env.local call and force string
function requireEnv(name: string): string{
    //read .env.local variable
    const value = process.env[name];
    //if something goes wrong, print message
    if(!value) throw new Error(`Missing env var: ${name}`);
    //return .env.local variable
    return value;
}


//Get twitch token
async function getAppAccessToken(): Promise<string> {
    //Variables
    const timeNow = Date.now();
    const buffer = 60_000; //avoid token expiring during request

    //if you have the token and its not close to expiring wtih the additional buffer time, reuse it
    if(cachedToken && cachedTokenExpiresAtMs > timeNow + buffer) return cachedToken;
    
    //get ClientId and clientSecrent from .env file
    const clientId = requireEnv("TWITCH_CLIENT_ID") ?? ""; 
    const clientSecret = requireEnv("TWITCH_CLIENT_SECRET") ?? ""; 

    //Error check
    if(!clientId || !clientSecret) throw new Error("Missing clientId or clientSecret");

    //Token URL
    //Get the token endpoint
    //searchParams.set tells the IRL out credentials(passkeys) and our grant_type(ig method of communication, in this case server to server)
    const tokenURL = new URL("https://id.twitch.tv/oauth2/token"); //endpoint for getting token
    tokenURL.searchParams.set("client_id",clientId); //provide clidentid
    tokenURL.searchParams.set("client_secret",clientSecret); //provide client secret
    tokenURL.searchParams.set("grant_type","client_credentials"); //The client credentials type means server to server 

    //Request token from Twitch
    const tokenRes = await fetch(tokenURL.toString(), { method: "POST" });

    //Token request erro check
    if(!tokenRes.ok) throw new Error(`Twitch Token request failed: ${tokenRes.status}`);

    //Shape token into TwitchTokenReponse type
    const tokenJSON = (await tokenRes.json()) as TwitchTokenResponse;

    //Store values in memory
    cachedToken = tokenJSON.access_token;
    //Convert time into actaul time stamp (*1000 to convert from S to MS).
    cachedTokenExpiresAtMs = timeNow + tokenJSON.expires_in * 1000;

    //return token string
    return cachedToken;
}

//Calling the actual igdb
async function igdbPost(endpoint: string, body: string){

    //Get token and client id
    const token = await getAppAccessToken();
    const clidentid = requireEnv("TWITCH_CLIENT_ID");

    //fetch data from igdb
    const request = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
        method: "POST",
        headers: { //For igdb to read and validate my request
            "Client-ID": clidentid,
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
        },
        body,
    });

    //if the request is rejected, throw detailed error
    if(!request.ok) {
        const errorText = await request.text().catch(() => "");
        throw new Error(`IGDB request failed: ${request.status} ${errorText}`);
    }
        

    //return json of reuqest
    return request.json();
}

//Search for game data
export async function searchGames(query: string) {
    
    //remove quotes "" to prevent breaking query text
    const safeQuery = query.replaceAll(`"`, "");

    //igdb game result format 
    const body = 
        `search "${safeQuery}"; `+
        `fields id,name,first_release_date,cover.url; ` +
        `where parent_game = null; ` + //filter search without DLC
        `limit 10;`; //max 10 results
    
    //request games endpoint
    const results = (await igdbPost("games", body)) as any[];

    //return converted result data
    return results.map((g) => ({
        id: g.id,
        name: g.name,
        firstReleaseDate: g.first_release_date ?? null,
        coverUrl: g.cover?.url ? `https:${g.cover.url}` : null,
    }));
}

//Get a game from their igdbID
export async function getGameByIgdbId(igdbId: number) {
    //Body, what to get from fetch 
    const body = 
        `fields id,name,summary,first_release_date,cover.url; ` +
        `where id = ${igdbId}; ` + 
        `limit 1;`; 

    //Get game
    const results = (await igdbPost("games", body)) as any[];
    const game = results[0] //get first (only result)

    if(!game) return null //return null if no game found

    //Return details
    return {
        title: game.name,
        coverUrl: game.cover?.url ? `https:${game.cover.url}` : null, 
        description: game.summary ?? null,
        releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
        developer: null, //extra db field do later
    };

}

//Get many games from their igdbID
export async function getManyGameByIgdbId(igdbIds: number[]) {
    const ids = igdbIds.filter((n) => Number.isFinite(n));
    if (ids.length === 0) return [];
    //Body, what to get from fetch 
    const body = 
        `fields id,name,summary,first_release_date,cover.url; ` +
        `where id = (${ids.join(",")}); ` + 
        `limit ${Math.min(ids.length, 50)};`; 

    //Get game
    const results = (await igdbPost("games", body)) as any[];

    //Return details
    return results.map((game) => ({
        id: game.id,
        title: game.name,
        coverUrl: game.cover?.url ? `https:${game.cover.url}` : null, 
        description: game.summary ?? null,
        releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
        developer: null, //extra db field do later
    }));
}

//Image scaler
export function igdbResizeImageUrl(url: string, size: string){
    //NOTE: Study this later
    const fullUrl = url.startsWith("//") ? `https:${url}` : url;
    return url.replace(/\/t_[^/]+\//, `/${size}/`);
}


//Get TrendingGames
export async function getTrendingGames(){
    const body = 
        `fields id,name,first_release_date,cover.url; ` +
        `sort popularity desc; ` +
        `where cover != null; ` +
        `linit 10; `;
    
    const results = (await igdbPost("games", body)) as any[];

    return results.map((g) => ({
        id: g.id,
        name: g.name,
        firstReleaseDate: g.first_release_date ?? null,
        coverUrl: g.cover?.url ? `https:${g.cover.url}` : null,
    }));
}

//Get games by name
export async function getGamesByNames(names: string[]){
    //Clean input
    const cleaned = names
        .map((n) => n.replaceAll(`"`, "".trim()))
        .filter(Boolean);

    //if no name
    if(cleaned.length === 0) return [];

    const whereClause = cleaned.map((n) => `"${n}"`).join(",");

    //Specify fields
    const body = 
        `fields id,name,first_release_date,cover.url;` + 
        `where name = (${whereClause}) & cover != null; ` +
        `limit ${Math.min(cleaned.length, 50)};`;
        
    const results = (await igdbPost("games", body)) as any[];

    return results.map((g) => ({
        id: g.id,
        name: g.name,
        firstReleaseDate: g.first_release_date ?? null,
        coverUrl: g.cover?.url ? `https:${g.cover.url}` : null,
    }));


}