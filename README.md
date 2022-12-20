# Hoshii

[![CI](https://github.com/helloreindev/hoshii/actions/workflows/ci.yml/badge.svg)](https://github.com/helloreindev/hoshii/actions/workflows/ci.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/helloreindev/hoshii/badge)](https://www.codefactor.io/repository/github/helloreindev/hoshii)
[![GitHub Release](https://img.shields.io/github/v/release/helloreindev/hoshii?include_prereleases)](https://github.com/helloreindev/hoshii/releases/latest)
[![NPM](https://img.shields.io/npm/v/hoshii?color=green)](https://npmjs.com/package/hoshii)

- Note: **This library is still in protoype version. Bugs are expected**

**Hoshii** is a NodeJS [Guilded](https://guilded.gg) library.

- **Documentation:** Coming Soon
- **GitHub**: [github.com/helloreindev/hoshii](https://github.com/helloreindev/hoshii)
- **Guilded Server**: [guilded.gg/hellorein](https://www.guilded.gg/hellorein)
- **NPM:** [npmjs.com/package/hoshii](https://npmjs.com/package/hoshii)

## Installation

You are required to have NodeJS version **16.16.0** or higher installed.

```bash
npm install hoshii
```

## Examples

```js
const Hoshii = require("hoshii");
const client = new Hoshii.Client("TOKEN");

client.on("ready", () => {
  console.log(`${client.user.name} is Ready!`);
});

client.on("chatMessageCreate", (message) => {
  if (message.member.bot) return;

  if (message.content === "!ping") {
    return client.createChannelMessage(message.channelID, {
      content: "Pong!",
    });
  }
});

client.connect();
```
