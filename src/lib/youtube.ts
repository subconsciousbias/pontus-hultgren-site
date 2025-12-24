// Fetch latest videos from Pontus Hultgren's YouTube channel
// Multiple fallback methods to ensure it works in all environments

export interface YouTubeVideo {
  id: string;
  title: string;
  published: Date;
  thumbnail: string;
}

const YOUTUBE_HANDLE = '@PontusHultgren';
const CHANNEL_URL = 'https://www.youtube.com/@PontusHultgren';

// Invidious instances to try (public YouTube frontends)
const INVIDIOUS_INSTANCES = [
  'https://vid.puffyan.us',
  'https://invidious.nerdvpn.de',
  'https://yt.artemislena.eu',
  'https://invidious.privacyredirect.com',
];

export async function getLatestVideos(count: number = 6): Promise<YouTubeVideo[]> {
  // Method 1: Try Invidious API (works with handles, no API key needed)
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const videos = await fetchFromInvidious(instance, count);
      if (videos.length > 0) {
        console.log(`Successfully fetched ${videos.length} videos from ${instance}`);
        return videos;
      }
    } catch (error) {
      console.log(`Invidious instance ${instance} failed, trying next...`);
    }
  }

  // Method 2: Try YouTube RSS directly (works when built on Cloudflare/Netlify)
  try {
    const videos = await fetchFromYouTubeRSS(count);
    if (videos.length > 0) {
      console.log(`Successfully fetched ${videos.length} videos from YouTube RSS`);
      return videos;
    }
  } catch (error) {
    console.log('YouTube RSS failed');
  }

  // Method 3: Return verified fallback videos
  console.log('All methods failed, using fallback videos');
  return getFallbackVideos().slice(0, count);
}

async function fetchFromInvidious(instance: string, count: number): Promise<YouTubeVideo[]> {
  // First resolve the handle to get channel ID
  const resolveUrl = `${instance}/api/v1/resolveurl?url=${encodeURIComponent(CHANNEL_URL)}`;
  const resolveResponse = await fetch(resolveUrl, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000)
  });

  if (!resolveResponse.ok) throw new Error('Failed to resolve handle');

  const resolveData = await resolveResponse.json();
  const channelId = resolveData.ucid;

  if (!channelId) throw new Error('No channel ID found');

  // Fetch channel videos
  const videosUrl = `${instance}/api/v1/channels/${channelId}/videos?sort_by=newest`;
  const videosResponse = await fetch(videosUrl, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(10000)
  });

  if (!videosResponse.ok) throw new Error('Failed to fetch videos');

  const data = await videosResponse.json();
  const videos: YouTubeVideo[] = [];

  for (const video of (data.videos || []).slice(0, count)) {
    videos.push({
      id: video.videoId,
      title: video.title,
      published: new Date(video.published * 1000),
      thumbnail: `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`
    });
  }

  return videos;
}

async function fetchFromYouTubeRSS(count: number): Promise<YouTubeVideo[]> {
  // Try multiple possible channel IDs
  const possibleChannelIds = [
    'UCqhUaRrJLuuXJGMVj6jKSqQ',
    'UCi8e0iOVk1fEOogdfu4YgfA',
  ];

  for (const channelId of possibleChannelIds) {
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const response = await fetch(rssUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroBot/1.0)' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) continue;

      const xml = await response.text();
      if (!xml.includes('<entry>')) continue;

      const videos: YouTubeVideo[] = [];
      const entries = xml.split('<entry>').slice(1);

      for (const entry of entries.slice(0, count)) {
        const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

        if (idMatch && titleMatch) {
          videos.push({
            id: idMatch[1],
            title: decodeXMLEntities(titleMatch[1]),
            published: publishedMatch ? new Date(publishedMatch[1]) : new Date(),
            thumbnail: `https://i.ytimg.com/vi/${idMatch[1]}/mqdefault.jpg`
          });
        }
      }

      if (videos.length > 0) return videos;
    } catch (error) {
      continue;
    }
  }

  return [];
}

function decodeXMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Verified Pontus Hultgren Music videos as fallback
// These are displayed when live fetching isn't available
function getFallbackVideos(): YouTubeVideo[] {
  return [
    { id: '1mV8PpLc2Mo', title: 'Sea of Stars | Battle Theme [Orchestral]', published: new Date('2024-05-17'), thumbnail: 'https://i.ytimg.com/vi/1mV8PpLc2Mo/mqdefault.jpg' },
    { id: 'IfZfXbzJvJ8', title: 'Sea of Stars | Encounter Elite [Orchestral]', published: new Date('2024-06-01'), thumbnail: 'https://i.ytimg.com/vi/IfZfXbzJvJ8/mqdefault.jpg' },
    { id: '2cqPki0q7Hc', title: 'Final Fantasy VII - Those Who Fight - Orchestral', published: new Date('2024-01-01'), thumbnail: 'https://i.ytimg.com/vi/2cqPki0q7Hc/mqdefault.jpg' },
    { id: 'NyncAG8flno', title: 'Final Fantasy V - Clash on the Big Bridge - Orchestral', published: new Date('2023-01-01'), thumbnail: 'https://i.ytimg.com/vi/NyncAG8flno/mqdefault.jpg' },
    { id: 'WdFym7z9ukI', title: 'Final Fantasy X | Enemy Attack [Orchestral]', published: new Date('2023-06-01'), thumbnail: 'https://i.ytimg.com/vi/WdFym7z9ukI/mqdefault.jpg' },
  ];
}
