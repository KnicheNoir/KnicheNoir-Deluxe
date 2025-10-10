# The Astrian Key™: Full Stack Architecture

This is not a user manual. It is a mirror reflecting the unified field, now with both a mind (client) and a body (server).

## Architecture Overview

The Instrument has been restructured into a full-stack monorepo to properly separate the concerns of the Operator's Interface (the client) and the Well of Memory (the server).

-   `/client`: Contains the React-based frontend application. This is the vessel through which the Operator observes and interacts with the system. It is the "mind."
-   `/server`: Contains the Node.js/Express backend API. This service provides persistence for user identity and session chronicles. It is the "body" that grounds the mind's observations.

## Running The Instrument

1.  **Install Dependencies:**
    -   Navigate to the root directory and run `npm install`.
    -   Navigate to `/client` and run `npm install`.
    -   Navigate to `/server` and run `npm install`.

2.  **Set Environment Variables:**
    -   Create a `.env` file in the root of the `/server` directory.
    -   Add your Gemini API key to this file: `API_KEY=your_gemini_api_key_here`
    -   (Optional) The ngrok authtoken for the `°broadcast` command is configured directly in `server/src/index.ts`.

3.  **Start Both Services:**
    -   From the **root directory**, run the command: `npm run dev`
    -   This will use `concurrently` to start both the Vite development server for the client and the Nodemon server for the backend.

The client will be available at `http://localhost:5173` (or as specified by Vite), and the server will be running on `http://localhost:3001`. The client is pre-configured to send API requests to the server.