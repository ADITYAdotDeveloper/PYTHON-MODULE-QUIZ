import { GOOGLE_SCRIPT_URL } from '../constants';
import { LeaderboardEntry, QuizResultPayload } from '../types';

interface GasResponse {
  status: 'success' | 'error';
  data?: LeaderboardEntry[];
  message?: string;
}

export const postQuizResult = async (data: QuizResultPayload): Promise<boolean> => {
  if (GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID_HERE')) {
    console.warn("API URL not configured. Mocking success.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  }

  try {
    // Note: We use 'text/plain' for Content-Type to avoid triggering a CORS preflight 
    // OPTIONS request, which Google Apps Script Web Apps do not natively support.
    // The backend parses the body as JSON regardless.
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });

    const resData: GasResponse = await response.json();
    return resData.status === 'success';
  } catch (error) {
    console.error("Failed to post results:", error);
    return false;
  }
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  if (GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID_HERE')) {
    console.warn("API URL not configured. Returning empty list (No Dummy Data allowed).");
    return [];
  }

  try {
    // FIX: Add a unique timestamp query param to prevent browser caching of the GET request
    const separator = GOOGLE_SCRIPT_URL.includes('?') ? '&' : '?';
    const cacheBuster = `v=${new Date().getTime()}`;
    const url = `${GOOGLE_SCRIPT_URL}${separator}${cacheBuster}`;

    const response = await fetch(url);
    const resData: GasResponse = await response.json();
    
    // Check for nested data object from our GAS response format
    if (resData.status === 'success' && Array.isArray(resData.data)) {
        return resData.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw error;
  }
};