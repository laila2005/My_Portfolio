# Portfolio Backend

## Setup

1. Copy `.env.example` to `.env` and fill in your values:
   - `RESEND_API_KEY` (from Resend dashboard)
   - `EMAIL_FROM` (e.g., onboarding@resend.dev)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Deploying to Render
- Add environment variables in the Render dashboard:
  - `RESEND_API_KEY`
  - `EMAIL_FROM`
- Set the start command to `npm start`.
- Expose port `5000` (or set `PORT` env variable).

## API
- POST `/api/contact` with JSON body:
  ```json
  {
    "name": "Your Name",
    "email": "your@email.com",
    "message": "Your message"
  }
  ``` 

## 1. Deploy the Backend as a Separate Service

- In Render, create a new service for your backend.
- Set the root directory for this service to backend (not the project root).
- The build and start commands should be:
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
- Make sure your environment variables are set in this backend service.

## 2. Commit and Push Your Changes

You need to commit and push the new backend folder and all changes to your repository so Render can deploy them.

### Example Git Commands

```sh
<code_block_to_apply_changes_from>
```

## 3. (Optional) Proxy API Requests in Development

If you want to test locally, you may need to run the backend and frontend separately and set up a proxy for `/api` requests in your frontend dev server.

---

### Summary

- Commit and push your changes.
- Set up a separate backend service on Render, pointing to the backend folder.
- Use `npm start` as the start command for the backend service.

Let me know if you need step-by-step instructions for any of these steps! 