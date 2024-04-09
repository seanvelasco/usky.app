<img src="https://usky.app/usky.svg" width="150"></img>

# usky.app

usky.app is a lightweight (29.91 kB gzipped) and minimalist web client for the decentralized social network, Bluesky.

usky.app allows you to see what's happening in Bluesky, join the conversation, discover new things, and look up people you know.

## Development

Clone the repository:

```bash
git clone https://github.com/seanvelasco/usky.app
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Stack

usky.app is a statically exported [Solid.js](https://www.solidjs.com/) SPA and PWA (previously a server-rendered SvelteKit app). Uses CSS modules for styling. Has two external dependencies: solid-router and solid-meta. All icons are from [Heroicons](https://heroicons.com/) (including app logo). Runs on [Cloudflare Pages](https://pages.cloudflare.com).
