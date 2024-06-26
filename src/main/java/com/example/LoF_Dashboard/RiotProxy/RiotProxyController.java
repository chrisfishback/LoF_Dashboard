package com.example.LoF_Dashboard.RiotProxy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class RiotProxyController {

    @Value("RGAPI-d6660762-3466-4c4c-a432-552e8816b0f2")
    private String apiKey;

    private final RestTemplate restTemplate;

    public RiotProxyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // get puuid
    // LinkedHashMap -> obj: "puuid", "gameName" (summoner name), "tagline"
    @GetMapping("/api/get-account/{summonerName}/{tagline}")
    public Object getAccount(@PathVariable String summonerName, @PathVariable String tagline) throws InterruptedException {
        Thread.sleep(15000);
        String url = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"
                + summonerName + "/" + tagline + "?api_key=" + apiKey;
        Object obj = restTemplate.getForObject(url, Object.class);
        return obj;
    }

    // get encrypted id / summoner level / summoner icon
    // LinkedHashMap -> obj: "id" (encrypted id), "accountId", "puuid", profileIconId (Integer), "revisionDate", "summonerLevel" (Integer)
    @GetMapping("/api/get-summoner/{puuid}")
    public Object getSummoner(@PathVariable String puuid) throws InterruptedException {
        Thread.sleep(15000);
        String url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/"
                + puuid + "?api_key=" + apiKey;
        Object obj = restTemplate.getForObject(url, Object.class);
        return obj;
    }

    // get ranked information
    // ArrayList -> obj: ???
    @GetMapping("/api/get-league-info/{id}")
    public Object getLeagueInformation(@PathVariable String id) throws InterruptedException {
        Thread.sleep(15000);
        String url = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/"
                + id + "?api_key=" + apiKey;
        Object obj = restTemplate.getForObject(url, Object.class);
        return obj;
    }
}
