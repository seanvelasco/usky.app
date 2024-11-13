<img src="https://usky.app/usky.svg" width="150"></img>

# usky.app

usky.app is a lightweight (221.33 kB gzipped) and minimalist web client for the decentralized social network, Bluesky.

usky.app allows you to see what's happening in Bluesky, join the conversation, discover new things, look up creators you know, and and find your people.

[![usky.app Home](https://img.sean.app/usky-home.png)](https://img.sean.app/usky-home.png)
[![usky.app profile](https://img.sean.app/usky-profile.png)](https://img.sean.app/usky-profile.png)

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

usky.app is a statically exported [Solid.js](https://www.solidjs.com/) SPA and PWA (previously a server-rendered SvelteKit app). Uses CSS modules for styling. All icons are from [Heroicons](https://heroicons.com/) (including app logo). Runs on [Cloudflare Pages](https://pages.cloudflare.com).

usky.app has only 8 dependencies. The official bsky.app client has 152 dependencies.

### Dependencies

-   solid-js
-   @solidjs/router
-   @solidjs/meta
-   @solid-primitives/storage
-   @ipld/car
-   @ipld/dag-cbor
-   @cbor-x
-   hls.js

### Icons

-   Fluent Icons
-   Heroicons
