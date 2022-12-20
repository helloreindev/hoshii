# Hoshii

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
  if (message.member.bot === true) return;

  if (message.content === "!ping") {
    client.createChannelMessage(message.channelID, { content: "Pong!" });
  }
});

client.connect();
```
