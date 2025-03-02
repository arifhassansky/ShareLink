# ShareLink - Private & Public Link Sharing System

## Overview

ShareLink is a web application that allows users to generate shareable links for text, images, or files with options for public and private access. The platform includes authentication for private links, expiration settings, and optional analytics for tracking link access.

## Features

- **Public & Private Links**: Users can create links with restricted or open access.
- **Authentication**: Secure login system for private link access.
- **Link Expiration**: Set expiry dates for shared links.
- **Analytics**: Track link access details (optional feature).
- **User-friendly Interface**: Built with React for a smooth user experience.
- **Backend API**: Powered by Express for efficient request handling.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Authentication**: Firebase
- **Styling**: Tailwind CSS

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/arifhassansky/ShareLink.git
   cd client
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Run the frontend**
   ```sh
   npm run dev
   ```
4. **Run the backend**
   ```sh
   cd server
   npm install
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```
MONGO_URI=your_mongodb_connection_string
FIREBASE_API_KEY=your_firebase_api_key
```

## Usage

1. Register or log in to create private links.
2. Upload or enter content to generate a shareable link.
3. Set access permissions and expiration settings.

## 🖼️ Screenshots

### Homepage

<div align="center">
  <img height="240" src="https://res.cloudinary.com/dl1zmxord/image/upload/v1740925155/hmho6mwighvxg82pnm2q.png">
</div>

### Tourist Dashboard

<div align="center">
  <img height="240" src="https://res.cloudinary.com/dl1zmxord/image/upload/v1740925231/hwmhcvlcrkvn0g9kmryt.png">
</div>

## 🗺️ Live Site

https://sharelinksky.netlify.app
