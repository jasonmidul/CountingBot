# Counting Bot

A powerful and customizable counting bot for Discord servers. Keep track of counting games, enforce rules, and log activities efficiently.

## Features

- Enforces counting rules
- Tracks counting progress
- Logs counting activities to a dedicated channel
- Supports multiple servers
- Redis and MongoDB integration for efficient data management
- Admin controls and developer features

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- [MongoDB](https://www.mongodb.com/) database
- [Redis](https://redis.io/) server
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Installation Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/jasonmidul/CountingBot.git
   cd CountingBot
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the project root and add your credentials:
   ```env
   token="your bot token"
   mongoUrl="mongodb+srv://xyz"
   logWebhook="https://discord.com/api/webhooks/xyz"
   redis="redis://xyz"
   ```
4. Run the bot:
   ```sh
   node index.js
   ```

## Configuration

Modify `config.js` to set up bot settings:

- `botToken`: Your Discord bot token
- `mongoUrl`: MongoDB connection string
- `redis`: Redis database URL
- `clientId`: Bot's client ID
- `logChannel`: Log channel ID
- `voteLog`: Voting log channel ID
- `deploySlashOnReady`: Whether to deploy slash commands on startup
- `underDevelopment`: Toggle development mode
- `developers`: List of bot developers
- `devGuilds`: List of development servers
- `betaTestGuilds`: List of beta test servers
- `cTopic`: Counting rules message
- `voteUrl`: URL to vote for the bot
- `logWebhook`: Webhook URL for logging

## Counting Rules

1. No Skipping Numbers
2. No Going Back In Numbers
3. Must Alternate Counters (except for solo mode)
4. No Botting, Scripting, or Abusing Bugs
5. Do Not Intentionally Ruin The Count

## Support

For issues or suggestions, open an issue on the [GitHub repository](https://github.com/jasonmidul/CountingBot).

## License

This project is licensed under the MIT License. See `LICENSE` for details.

