import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  if (!API_KEY) throw new Error("YOUTUBE_API_KEY is not defined");

  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      part: "snippet",
      maxResults: 12,
      q: query,
      type: "video",
      key: API_KEY,
    },
  });

  return response.data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
  }));
}

export async function getVideoDetails(videoId: string): Promise<YouTubeVideo> {
  if (!API_KEY) throw new Error("YOUTUBE_API_KEY is not defined");

  const response = await axios.get(`${BASE_URL}/videos`, {
    params: {
      part: "snippet",
      id: videoId,
      key: API_KEY,
    },
  });

  const item = response.data.items[0];
  return {
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
  };
}
