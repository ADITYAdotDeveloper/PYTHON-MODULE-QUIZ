# Google Apps Script Backend Setup

Follow these steps to deploy the backend for the Python Modules Quiz.

## 1. Create the Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. Name it **"Python Quiz Results"**.
3. In the first row (Header), add exactly these columns:
   - `timestamp`
   - `name`
   - `score`
   - `quote`

## 2. Add the Script
1. In the Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any existing code in the code editor.
3. Copy the contents of `backend/Code.js` from this project and paste it into the script editor.
4. (Optional) Run the `setupSheet` function once to ensure headers are clean, though you can do this manually.

## 3. Deploy as Web App
1. Click the blue **Deploy** button > **New deployment**.
2. Click the "Select type" gear icon > **Web app**.
3. Configure the following:
   - **Description**: Quiz Backend
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy**.
5. Authorize the script when prompted (you may need to click "Advanced" > "Go to... (unsafe)").

## 4. Connect to Frontend
1. Copy the **Web App URL** (ends in `/exec`).
2. Open `constants.ts` in your frontend project.
3. Replace the `GOOGLE_SCRIPT_URL` value with your new Web App URL.

## 5. API Usage Examples

### POST Request (Save Result)
```javascript
fetch(WEB_APP_URL, {
  method: "POST",
  // Use text/plain to avoid CORS preflight issues on GAS, 
  // but send JSON string as body.
  headers: {
    "Content-Type": "text/plain;charset=utf-8"
  },
  body: JSON.stringify({
    name: "John Doe",
    score: 8,
    timestamp: "2025-01-01T14:22:00.000Z",
    quote: "Dream bigger. Do bigger."
  })
})
```

### GET Request (Fetch Leaderboard)
```javascript
fetch(WEB_APP_URL)
  .then((res) => res.json())
  .then((response) => {
    // response.data contains the array of rows
    console.log(response.data);
  })
```
