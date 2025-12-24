// Fetch latest videos from YouTube RSS feed (no API key needed)
export interface YouTubeVideo {
  id: string;
  title: string;
  published: Date;
  thumbnail: string;
}

const CHANNEL_ID = 'UCi8e0iOVk1fEOogdfu4YgfA';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export async function getLatestVideos(count: number = 6): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    // Parse XML manually (works in both Node and browser)
    const videos: YouTubeVideo[] = [];
    const entries = xml.split('<entry>').slice(1); // Skip first split (before first entry)

    for (const entry of entries.slice(0, count)) {
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

      if (idMatch && titleMatch) {
        const id = idMatch[1];
        videos.push({
          id,
          title: decodeXMLEntities(titleMatch[1]),
          published: publishedMatch ? new Date(publishedMatch[1]) : new Date(),
          thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
        });
      }
    }

    return videos;
  } catch (error) {
    console.error('Failed to fetch YouTube RSS:', error);
    // Return fallback videos if fetch fails
    return getFallbackVideos();
  }
}

function decodeXMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Fallback videos in case RSS fetch fails
function getFallbackVideos(): YouTubeVideo[] {
  return [
    { id: 'NyncAG8flno', title: 'Final Fantasy V - Clash on the Big Bridge - Orchestral', published: new Date(), thumbnail: 'https://i.ytimg.com/vi/NyncAG8flno/mqdefault.jpg' },
    { id: 'WdFym7z9ukI', title: 'Final Fantasy X - Enemy Attack - Orchestral', published: new Date(), thumbnail: 'https://i.ytimg.com/vi/WdFym7z9ukI/mqdefault.jpg' },
  ];
}
