/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import getAnimeInfo from "@/utils/getAnimeInfo.utils";
import getStreamInfo from "@/utils/getStreamInfo.utils";
import getEpisodes from "@/utils/getEpisodes.utils";
import getNextEpisodeSchedule from "../utils/getNextEpisodeSchedule.utils";
import getServers from "../utils/getServers.utils";

export const useWatch = (animeId, initialEpisodeId) => {
  const [error, setError] = useState(null);
  const [buffering, setBuffering] = useState(true);
  const [streamInfo, setStreamInfo] = useState(null);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [animeInfoLoading, setAnimeInfoLoading] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [servers, setServers] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isFullOverview, setIsFullOverview] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [intro, setIntro] = useState(null);
  const [outro, setOutro] = useState(null);
  const [episodeId, setEpisodeId] = useState(null);
  const [activeEpisodeNum, setActiveEpisodeNum] = useState(null);
  const [activeServerId, setActiveServerId] = useState(null);
  const [activeServerType, setActiveServerType] = useState(null);
  const [activeServerName, setActiveServerName] = useState(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [nextEpisodeSchedule, setNextEpisodeSchedule] = useState(null);
  const isServerFetchInProgress = useRef(false);
  const isStreamFetchInProgress = useRef(false);

  useEffect(() => {
    setEpisodes(null);
    setEpisodeId(null);
    setActiveEpisodeNum(null);
    setServers(null);
    setActiveServerId(null);
    setActiveServerType(null);
    setActiveServerName(null);
    setStreamInfo(null);
    setStreamUrl(null);
    setSubtitles([]);
    setThumbnail(null);
    setIntro(null);
    setOutro(null);
    setBuffering(true);
    setServerLoading(true);
    setError(null);
    setAnimeInfo(null);
    setSeasons(null);
    setTotalEpisodes(null);
    setAnimeInfoLoading(true);
    isServerFetchInProgress.current = false;
    isStreamFetchInProgress.current = false;
  }, [animeId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setAnimeInfoLoading(true);
        // const url = `/api/info?id=${id}&epi=true`;
        // const response = await fetch(url);
        // const data = await response.json();
        const [animeData, episodesData] = await Promise.all([
          getAnimeInfo(animeId, false),
          getEpisodes(animeId),
        ]);
        // const animeData = data.info;
        // const episodesData = data.episode;
        setAnimeInfo(animeData?.data);
        setSeasons(animeData?.seasons);
        setEpisodes(episodesData?.episodes);
        setTotalEpisodes(episodesData?.totalEpisodes);
        const newEpisodeId =
          initialEpisodeId ||
          (episodesData?.episodes?.length > 0
            ? episodesData.episodes[0].id.match(/ep=(\d+)/)?.[1]
            : null);
        setEpisodeId(newEpisodeId);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setAnimeInfoLoading(false);
      }
    };
    fetchInitialData();
  }, [animeId]);

  useEffect(() => {
    const fetchNextEpisodeSchedule = async () => {
      try {
        const data = await getNextEpisodeSchedule(animeId);
        setNextEpisodeSchedule(data);
      } catch (err) {
        console.error("Error fetching next episode schedule:", err);
      }
    };
    fetchNextEpisodeSchedule();
  }, [animeId]);

  useEffect(() => {
    if (!episodes || !episodeId) {
      setActiveEpisodeNum(null);
      return;
    }
    const activeEpisode = episodes.find((episode) => {
      const match = episode.id.match(/ep=(\d+)/);
      return match && match[1] === episodeId;
    });
    const newActiveEpisodeNum = activeEpisode ? activeEpisode.episode_no : null;
    if (activeEpisodeNum !== newActiveEpisodeNum) {
      setActiveEpisodeNum(newActiveEpisodeNum);
    } 
  }, [episodeId, episodes]);

  useEffect(() => {
    if (!episodeId || !episodes || isServerFetchInProgress.current) return;

    const fetchServers = async () => {
      isServerFetchInProgress.current = true;
      setServerLoading(true);
      try {
        const data = await getServers(animeId, episodeId);

        // Filter allowed servers
        const allowedServers = [
          "HD-1",
          "HD-2",
          "HD-3",
          "Vidstreaming",
          "Vidcloud",
          "DouVideo",
        ];

        const filteredServers =
          data?.filter((server) =>
            allowedServers.includes(server.serverName)
          ) || [];

        // Add extra servers (HD-4, HD-5) if SUB or DUB servers exist
        const hasSub = filteredServers.some((s) => s.type === "sub");
        const hasDub = filteredServers.some((s) => s.type === "dub");

        if (hasSub) {
          filteredServers.push({
            type: "sub",
            data_id: "69696968",
            server_id: "41",
            serverName: "HD-4",
          });
          if (animeInfo?.anilistId !== null) {
            filteredServers.push({
              type: "sub",
              data_id: "69696969",
              server_id: "44",
              serverName: "HD-5",
            });
          }
        }

        if (hasDub) {
          filteredServers.push({
            type: "dub",
            data_id: "96969696",
            server_id: "42",
            serverName: "HD-4",
          });
          if (animeInfo?.anilistId !== null) {
            filteredServers.push({
              type: "dub",
              data_id: "96969697",
              server_id: "43",
              serverName: "HD-5",
            });
          }
        }

        // Add placeholders for missing servers (buttons without data)
        const requiredServers = ["Vidstreaming", "DouVideo", "Vidcloud"];
        requiredServers.forEach((name) => {
          ["sub", "dub"].forEach((type) => {
            if (
              !filteredServers.find(
                (s) => s.serverName === name && s.type === type
              )
            ) {
              filteredServers.push({
                type,
                data_id: null,
                server_id: null,
                serverName: name,
                placeholder: true, // Helps disable button later
              });
            }
          });
        });

        // Restore previously selected server or pick the first available
        const savedServerName = localStorage.getItem("server_name");
        const savedServerType = localStorage.getItem("server_type");
        const initialServer =
          filteredServers.find(
            (s) =>
              s.serverName === savedServerName && s.type === savedServerType
          ) ||
          filteredServers.find((s) => s.serverName === savedServerName) ||
          filteredServers.find((s) => s.type === savedServerType) ||
          filteredServers[0];

        setServers(filteredServers);
        setActiveServerType(initialServer?.type);
        setActiveServerName(initialServer?.serverName);
        setActiveServerId(initialServer?.data_id);
      } catch (error) {
        console.error("Error fetching servers:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setServerLoading(false);
        isServerFetchInProgress.current = false;
      }
    };

    fetchServers();
  }, [episodeId, episodes]);

  // Fetch stream info only when episodeId, activeServerId, and servers are ready
  useEffect(() => {
    if (
      !episodeId ||
      !activeServerId ||
      !servers ||
      isServerFetchInProgress.current ||
      isStreamFetchInProgress.current
    )
      return;
    if (
      (activeServerName?.toLowerCase() === "hd-1" ||
        activeServerName?.toLowerCase() === "hd-4") &&
      !serverLoading
    ) {
      setBuffering(false);
      return;
    }
    const fetchStreamInfo = async () => {
      isStreamFetchInProgress.current = true;
      setBuffering(true);
      try {
        const server = servers.find((srv) => srv.data_id === activeServerId);
        if (server) {
          const data = await getStreamInfo(
            animeId,
            episodeId,
            server.serverName.toLowerCase(),
            server.type.toLowerCase()
          );
          setStreamInfo(data);
          setStreamUrl(data?.streamingLink?.link?.file || null);
          setIntro(data?.streamingLink?.intro || null);
          setOutro(data?.streamingLink?.outro || null);
          const subtitles =
            data?.streamingLink?.tracks
              ?.filter((track) => track.kind === "captions")
              .map(({ file, label }) => ({ file, label })) || [];
          setSubtitles(subtitles);
          const thumbnailTrack = data?.streamingLink?.tracks?.find(
            (track) => track.kind === "thumbnails" && track.file
          );
          if (thumbnailTrack) setThumbnail(thumbnailTrack.file);
        } else {
          setError("No server found with the activeServerId.");
        }
      } catch (err) {
        console.error("Error fetching stream info:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setBuffering(false);
        isStreamFetchInProgress.current = false;
      }
    };
    fetchStreamInfo();
  }, [episodeId, activeServerId, servers]);

  return {
    error,
    buffering,
    serverLoading,
    streamInfo,
    animeInfo,
    episodes,
    nextEpisodeSchedule,
    animeInfoLoading,
    totalEpisodes,
    seasons,
    servers,
    streamUrl,
    isFullOverview,
    setIsFullOverview,
    subtitles,
    thumbnail,
    intro,
    outro,
    episodeId,
    setEpisodeId,
    activeEpisodeNum,
    setActiveEpisodeNum,
    activeServerId,
    setActiveServerId,
    activeServerType,
    setActiveServerType,
    activeServerName,
    setActiveServerName,
  };
};
