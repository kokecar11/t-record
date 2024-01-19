# T-Record App 🟣
T-record is a powerful app designed to revolutionize your Twitch presence. With t-record, you can effortlessly create bookmarks, have precise control over your clips, and amplify your content like never before. Dominate the Twitch scene and make a lasting impression in every stream!
- [Twitter](https://twitter.com/Kokecar11)
- [T-Record](https://t-record.vercel.app/)
---

## Features

* **Effortless Bookmark Creation**: Create bookmarks with ease, allowing you to mark and revisit key moments in your Twitch streams.

* **Precise Clip Control**: Take complete control over your clips, ensuring you capture and manage your most epic moments flawlessly.

* **Content Enhancement**: With t-record, your content will reach new heights. Enhance your Twitch streams by organizing and showcasing your best clips seamlessly.

## Usage
1. Go to [T-Record](https://t-record.vercel.app/).
2. Connect your Twitch account.
3. Start streaming on Twitch.
4. Use the intuitive interface to create bookmarks during your stream.
5. Gain precise control over your clips for later use.
6. Enhance your content by incorporating your best clips seamlessly.

## Vercel Edge

This starter site is configured to deploy to [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), which means it will be rendered at an edge location near to your users.

## Installation

The adaptor will add a new `vite.config.ts` within the `adapters/` directory, and a new entry file will be created, such as:

```
└── adapters/
    └── vercel-edge/
        └── vite.config.ts
└── src/
    └── entry.vercel-edge.tsx
```

Additionally, within the `package.json`, the `build.server` script will be updated with the Vercel Edge build.

## Production build

To build the application for production, use the `build` command, this command will automatically run `pnpm build.server` and `pnpm build.client`:

```shell
pnpm build
```

[Read the full guide here](https://github.com/BuilderIO/qwik/blob/main/starters/adapters/vercel-edge/README.md)

## Dev deploy

To deploy the application for development:

```shell
pnpm deploy
```

Notice that you might need a [Vercel account](https://docs.Vercel.com/get-started/) in order to complete this step!

## Production deploy

The project is ready to be deployed to Vercel. However, you will need to create a git repository and push the code to it.

You can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.

## Express Server

This app has a minimal [Express server](https://expressjs.com/) implementation. After running a full build, you can preview the build using the command:

```
pnpm serve
```

Then visit [http://localhost:8080/](http://localhost:8080/)
