<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=CountingBot&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>

[![Version][version-shield]](version-url)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Run on Repl.it](https://repl.it/badge/github/jasonmidul/CountingBot)](https://repl.it/github/jasonmidul/CountingBot)


  <h1 align="center">CountingBot</h1>

  <p align="center">CountingBot is a Discord counting bot made with discord.js v14.
    <br />
    <br />
    <a href="https://github.com/jasonmidul/CountingBot/issues">Report Bug & Request Feature</a>
  </p>
</p>

## 🔥 Unique Features

-   Developed using Discord.js v14
-   Advanced Counting System
-   Top.gg vote reward
-   User saves
-   User-friendly and Easy to Use
-   Slash commands
-   Leaderboard system
-   Math count
-   Customizable settings

### **Need Help with setup?** Join our [Discord Server](https://discord.gg/PZQT6c7gJn) and ask in the `#support` channel

## 🔧 Requirements

Before starting with the installation, you need to have the following:

-   ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) [v18.16.0 or higher](https://nodejs.org/en/download/)
-   ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) [v7.2.2 or higher](https://www.mongodb.com/try/download/community)

## 🚀 Installation from source

1. Clone the CountingBot repository:

```bash
git clone https://github.com/jasonmidul/CountingBot.git
```

2. change the directory to CountingBot

```bash
cd CountingBot
```

3. Install the required packages:

```bash
npm i
```

4. Set up your environment variables:

Create a `.env` file in the root directory of your project with the following variables:

```bash
TOKEN="." ## Your bot token
MONGO="mongodb+srv://xyz:xyz@xyz.rn0v74r.mongodb.net/?retryWrites=true&w=majority" ## Your MongoDb Url.
```

Than fill `config.json` file to your variables:

```bash
{
  "global": true, ## Global slash command
  "devGuildId": "1022398942983495680", ## Devloper guild id
  "clientId": "1106236979147964426", ## Bot client id
  "devs": ["948807824446742568"], ## Developers id
  "logChannel": "1096824161403420729", ## Command log channel
  "color": " White",
  "voteLog": "1127416321320173688", ## Bot vote log channel
  "support": "https://discord.gg/PZQT6c7gJn" ## Bot support server
}

```

5. Go to `Events/Vote/VoteEvent.js` than change the port at line 93.

```js
app.listen(YOUR_SERVER_PORT);
```

6. Make a url:

```bash
http://YOUR_IP:PORT/vote

## replace YOUR_IP to your server/vps ip and replace PORT to your server/vps port
```

7. Than go on top.gg bot webhook site. And replace the webhook url to this url.

8. Also out `vote` in Authorization option.

9. Run the bot:

```bash
npm run ./Structures/index.js or node .
```

10. Invite the bot to your server:

Generate an invite link for your bot and invite it to your server using the Discord Developer Portal or using permissions calculator: <https://discordapi.com/permissions.html>

## 🔗 Useful Links

-   ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) [Node.js](https://nodejs.org/en/download/)
-   ![Discord.js](https://img.shields.io/badge/Discord.js-7289DA?style=for-the-badge&logo=discord&logoColor=white) [Discord.js](https://discord.js.org/#/)
-   ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) [MongoDB](https://www.mongodb.com/)
