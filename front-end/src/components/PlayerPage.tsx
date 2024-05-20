import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Player} from "../App.tsx";
import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import PlayerGameInfo, {GameInfo} from "./PlayerGameInfo.tsx";

type PlayerPageProps = { player: Player };

function PlayerPage(props : PlayerPageProps) {

    const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({} as PlayerInfo)

    //const {player} = props
    let {id, puuid, summonerId, summonerName, team, tagline} = props.player;

    let tempInfo : PlayerInfo = {
        summonerName: summonerName,
        rank: "temp",
        lastTwentyGames: [],
        lastTwentyGamesInfo: [],
        summonerLevel: "-1",
    }

    async function getAccountInformation() {
        // https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/thebighook/NA1?api_key=***

        const puuid_url = `/api/get-account/${summonerName}/${tagline}`;

        await axios.get(puuid_url)
            .then((response: AxiosResponse) => {
                console.log("Request: getAccountInformation");
                puuid = response.data.puuid;
                getSummonerInformation(puuid);
            })
            .catch((error) => {
                console.error('Error fetching summoner data: ', error);
            });
    }

    function getSummonerInformation(init_puuid: string) {
        const summonerId_url = `/api/get-summoner/${init_puuid}`;

        axios.get(summonerId_url)
            .then((response: AxiosResponse) => {
                console.log("Request: getSummonerInformation");
                summonerId = response.data.id;
                tempInfo.summonerLevel = response.data.summonerLevel;
                getLeagueInformation(summonerId, init_puuid);
            })
            .catch((error) => {
                console.error('Error fetching account data: ', error);
            });
    }

    function getLeagueInformation(init_id: string, init_puuid: string) {
        // /lol/league/v4/entries/by-summoner/{encryptedSummonerId}

        const leagueInfo_url = `/api/get-league-info/${init_id}`

        axios.get(leagueInfo_url)
            .then((response: AxiosResponse) => {
                console.log("Request: getLeagueInformation");
                if (response.data.length === 0) {
                    tempInfo.rank = "No rank available this season";
                } else {
                    tempInfo.rank = "I need to do something about this - you have a rank";
                }
                getRankedMatchHistory(init_puuid);
            })
            .catch((error) => {
                console.error('Error fetching league data:', error);
            });
    }

    function getRankedMatchHistory(init_puuid: string) {
        const matchInfo_url = `/api/get-matches/${init_puuid}`;

        await axios.get(matchInfo_url)
            .then((response: AxiosResponse) => {
                console.log(response.data);

                tempInfo.lastTwentyGames = response.data;
                tempInfo.lastTwentyGames.map(el => {
                    if (el != null)
                        getMatchInformation(el)
                    else
                        console.log("NULL DATA")
                })

                // set player info state upon receiving full data
                setPlayerInfo(tempInfo);
            })
            .catch((error) => {
                console.error('Error fetching match data:', error);
            });
    }

    async function getMatchInformation(matchId: string) {
        const matchId_url = `/api/get-match-info/${matchId}`

        await axios.get(matchId_url)
            .then((response: AxiosResponse) => {
                console.log("Request: getMatchInformation");
                parseMatchData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching matchId data:', error);
            });
    }

    function parseMatchData(matchData: any) {
        let playerNumber = -1;

        const tempGameInfo: GameInfo = {
            champion: "",
            win: false,
            lane: "",
            kills: -1,
            deaths: -1,
            assists: -1,
        };

        let index = 0;
        matchData.info.participants.map((player: any) => {
            if (player.summonerName === tempInfo.summonerName) {
                playerNumber = index;
            }
            index++;
        });

        if (playerNumber !== -1) {
            const participant = matchData.info.participants[playerNumber];
            tempGameInfo.champion = participant.championName;
            tempGameInfo.win = participant.win;
            tempGameInfo.lane = participant.lane;
            tempGameInfo.kills = participant.kills;
            tempGameInfo.deaths = participant.deaths;
            tempGameInfo.assists = participant.assists;

            tempInfo.lastTwentyGamesInfo.push(tempGameInfo);
        } else {
            console.log("ERROR FINDING CHAMPION INFORMATION");
        }
    }

    //get correct PUUID and summonerID using tagline and summonerName
    useEffect(  () => {
        getAccountInformation();
    }, []);

    return (
        <>
            <Accordion key={id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${id}-content`} id={`${id}-${team}-header`}>
                    <Typography>{summonerName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="h5">Ranked Game History</Typography>
                    {playerInfo && playerInfo.lastTwentyGamesInfo ? (playerInfo.lastTwentyGamesInfo.map((game, index) => (
                        <PlayerGameInfo key={index} gameInfo={game} />
                    ))) : (
                        <Typography>No game history available</Typography>
                    )}
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default PlayerPage;

type PlayerInfo = {
    summonerName: string;
    rank: string;
    lastTwentyGames: string[];
    lastTwentyGamesInfo: GameInfo[];
    summonerLevel: string;
}