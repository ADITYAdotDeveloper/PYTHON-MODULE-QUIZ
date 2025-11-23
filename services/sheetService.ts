import { GOOGLE_SCRIPT_URL } from '../constants';
import { LeaderboardEntry, QuizResultPayload } from '../types';

interface GasResponse {
  status: 'success' | 'error';
  data?: LeaderboardEntry[];
  message?: string;
}

export const postQuizResult = async (data: QuizResultPayload): Promise<boolean> => {
  try {
    // IMPORTANT: method: 'POST', body: JSON string
    // 'redirect: follow' is CRITICAL for GAS Web Apps
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow', 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // avoiding CORS preflight
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    
    // Safety check for HTML responses (Permission errors)
    if (text.trim().startsWith('<')) {
      console.error("Server returned HTML. Check permissions.", text);
      return false;
    }

    try {
      const resData: GasResponse = JSON.parse(text);
      return resData.status === 'success';
    } catch (e) {
      console.error("Failed to parse response:", text);
      return false;
    }

  } catch (error) {
    console.error("Network error during POST:", error);
    return false;
  }
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const separator = GOOGLE_SCRIPT_URL.includes('?') ? '&' : '?';
    const cacheBuster = `v=${new Date().getTime()}`;
    const url = `${GOOGLE_SCRIPT_URL}${separator}${cacheBuster}`;

    // IMPORTANT: redirect: 'follow' ensures we follow the Google 302 redirect to the data
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow'
    });
    
    const text = await response.text();

    if (text.trim().startsWith('<')) {
      console.error("Leaderboard fetch returned HTML.", text);
      throw new Error("Server Permission Error");
    }

    let resData: GasResponse;
    try {
      resData = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid JSON response");
    }
    
    if (resData.status === 'success' && Array.isArray(resData.data)) {
        return resData.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw error;
  }
};