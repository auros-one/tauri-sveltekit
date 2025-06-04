# Creating a desktop application with Tauri and SvelteKit

> [!NOTE]  
> Clone this repository to get the final result of this tutorial.

## Step 0: Prerequisites

Make sure you have all [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) set up.

## Step 1: Setup SvelteKit project

Create a SvelteKit project and proceed through the prompts to set it up.

```shell
npm create svelte@latest tauri-sveltekit
cd tauri-sveltekit
npm install
```

Alternatively, you can use one of your existing SvelteKit projects.

### Setup adapter-static

Tauri looks for static files to display in its WebView. SvelteKit has the [@sveltejs/adapter-static adapter](https://kit.svelte.dev/docs/adapters#supported-environments-static-sites) to build static websites.

Install the adapter with:

```shell
npm install -D @sveltejs/adapter-static@next
```

Set up the new adapter in `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-static'; // <-- adapter-static replaces adapter-auto
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		// some settings for adapter-static:
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		})
	}
};

export default config;
```

Uninstall the old adapter with:

```shell
npm uninstall -D @sveltejs/adapter-auto
```

### Disable server-side rendering (SSR)

To disable server side rendering create the following `src/+layout.js` file:

```javascript
export const prerender = true;
export const ssr = false;
```

([more info](https://kit.svelte.dev/docs/page-options#ssr))

### Create sveltekit scripts

Add the following SvelteKit scripts to your `package.json`:

```json
{
	"scripts": {
		"sveltekit:dev": "svelte-kit dev",
		"sveltekit:build": "svelte-kit build"
	}
}
```

## Step 2: Add Tauri CLI

[Tauri CLI](https://tauri.app/v1/api/cli/) is for building and bundeling your app. It's the part of Tauri that turns your website (SvelteKit project) into a desktop app.

At the root of you SvelteKit project, add the Tauri CLI as a developer dependency:

```shell
npm install -D @tauri-apps/cli
```

Add a Tauri script and update the dev and build script in your `package.json`:

```json
{
	"scripts": {
		"dev": "npm run tauri dev",
		"build": "npm run tauri build",
		"tauri": "tauri"
	}
}
```

## Step 3: Setup Tauri

Initialise Tauri with `npm run tauri init`. When proceeding through the prompts, update some of the suggested settings to match the SvelteKit dev server and build output.

```shell
npm tauri init
> What is your app name? › tauri-sveltekit
> What should the window title be? (tauri-sveltekit) › Tauri x SvelteKit
> Where are your web assets (HTML/CSS/JS) located, relative to the "<current dir>/src-tauri/tauri.conf.json" file that will be created? (../public) › ../build <-- Change the default location to ../build
> What is the url of your dev server? › http://localhost:5173 <-- Change the port to 5173
> What is your frontend dev command? · npm run sveltekit:dev <-- Update the dev command
> What is your frontend build command? · npm run sveltekit:build <-- Update the build command
```

If you want to change any of these settings afterwards, they are available in `src-tauri/tauri.conf.json`

### Optional: Using another port

You can choose the port on which the SvelteKit website is hosted during local development. Just point the Tauri devPath to the SvelteKit development server.

Set the SvelteKit development server port in `vite.config.js`:

```javascript
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		port: YOUR_PREFERRED_PORT
	}
};

export default config;
```

Set the Tauri devPath in `src-tauri/tauri.conf.json`:

```json
{
	"build": {
		"devPath": "http://localhost:YOUR_PREFERRED_PORT"
	}
}
```

## Step 4: Optional: Add Tauri API

While the previously added [Tauri CLI](https://tauri.app/v1/api/cli/) handles building and bundeling your app, the [Tauri API](https://tauri.app/v1/api/js/) adds backend functionality. This API is optional since you won't need it if you're just rendering a static website to communicate with a remote server. However, if you want access to more than a standard browser environment you will need it.

Tauri API Examples:

- [Call a custom command (defined in the Rust backend)](https://tauri.app/v1/api/js/modules/tauri#invoke)
- [Access to the file system (read- and writing files)](https://tauri.app/v1/api/js/modules/fs)
- [Read and write to the system clipboard](https://tauri.app/v1/api/js/modules/clipboard)

Add the the Tauri API to your project with:

```
npm install @tauri-apps/api
```

Note that in contrast to the CLI, this isn't a developer dependency because it's not only a build-stage and development requirement but also a production requirement.

### `allowlist`

To improve security, Tauri only allows backend API calls that are allowlisted in `src-tauri/tauri.conf.json`.

For example the file system API can be allowlisted in `src-tauri/tauri.conf.json` like this:

```json
{
	"tauri": {
		"allowlist": {
			"fs": {
				"all": true, // enable all FS APIs
				"readFile": true,
				"writeFile": true,
				"readDir": true,
				"copyFile": true,
				"createDir": true,
				"removeDir": true,
				"removeFile": true,
				"renameFile": true
			}
		}
	}
}
```

## Step 5: Run or build Tauri app

### Run Tauri app

```shell
npm run dev
```

The first time you run the Tauri app it will generate a `Cargo.lock` file. It's purpose is _"to describe the state of the world at the time of a successful build"_ and you should add it to your version control ([source](https://doc.rust-lang.org/cargo/faq.html#why-do-binaries-have-cargolock-in-version-control-but-not-libraries)).

### Build Tauri app

To build your Tauri app you must specify its identifier in reverse domain name notation (e.g. `com.tauri.my-tauri-app`). This string must be unique across applications and contain only alphanumeric characters (A–Z, a–z, and 0–9), hyphens (-), and periods (.).

Set your application identifier in `src-tauri/tauri.conf.json`:

```json
{
	"tauri": {
		"bundle": {
			"identifier": "com.example.my-tauri-app"
		}
	}
}
```

Then build your app with:

```shell
npm run build
```

It will detect your operating system and build a bundle accordingly. The result will be located in `src-tauri/target/release`.

For more information about building applications for different platforms check out [the official documentation](https://tauri.app/v1/guides/building/)
