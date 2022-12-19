# Hoshii

- Note: **This library isn't in stable state yet. Any form of bugs are expected**

**Hoshii** is a NodeJS [Guilded](https://guilded.gg) library.

- **Guilded Server**: [guilded.gg/hellorein](https://www.guilded.gg/hellorein)
- **GitHub**: [github.com/helloreindev/hoshii](https://github.com/helloreindev/hoshii)

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
  if (message.member.bot === true) return;

  if (message.content === "!ping") {
    client.createChannelMessage(message.channelID, { content: "Pong!" });
  }
});

client.connect();
```
