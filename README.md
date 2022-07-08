# Creating a desktop application with Tauri and SvelteKit

The resulting example code of this tutorial is available on [Github](https://github.com/Stijn-B/tauri-sveltekit-example)

[**Tauri**](https://tauri.app/) is a framework for building tiny, blazing fast binaries for all major desktop platforms. Developers can integrate any front-end framework that compiles to HTML, JS and CSS for building their user interface. Tauri places a great emphasis on [security](https://tauri.app/v1/guides/development/security). You can check out how the Tauri architecture works and get a grasp on how the different components integrate [here](https://tauri.app/v1/guides/architecture/).

[**SvelteKit**](https://kit.svelte.dev/) is an application framework powered by Svelte which applies a new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app. Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically updates the DOM when the state of your app changes which results in better performance.

## Step 0: Prerequisites

Make sure you have all [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) set up.

## Step 1: Setup SvelteKit project

Create a SvelteKit project and proceed through the prompts to set it up.

```shell
npm init svelte tauri-sveltekit
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
import adapter from '@sveltejs/adapter-static';  // <-- adapter-static replaces adapter-auto
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {  // some settings for adapter-static:
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),
	}
};

export default config;
```

Uninstall the old adapter with:

```shell
npm uninstall -D @sveltejs/adapter-auto
```

### Disable server-side rendering (SSR)

To disable server side rendering create a `src/hooks.js` file:
```javascript
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    return resolve(event, { ssr: false });
}
```

## Step 2: Add Tauri CLI

[Tauri CLI](https://tauri.app/v1/api/cli/) is for building and bundeling your app. It's the part of Tauri that turns your website (SvelteKit project) into a desktop app.

At the root of you SvelteKit project, add the Tauri CLI as a developer dependency:

```shell
npm install -D @tauri-apps/cli
```

Add a Tauri script to your `package.json`:

```json
{
  "scripts": {
    "tauri": "tauri"
  }
}
```

## Step 3: Initialise Tauri

Initialise Tauri with `npm tauri init`. When proceeding through the prompts, set the web assets location to `../build` and the url of the dev server to `http://localhost:3000` (the default SvelteKit development server).

```shell
npm tauri init
> What is your app name? › tauri-sveltekit
> What should the window title be? (tauri-sveltekit) › tauri-sveltekit
> Where are your web assets (HTML/CSS/JS) located, relative to the "<current dir>/src-tauri/tauri.conf.json" file that will be created? (../public) › ../build <-- Change the default location to ../build
> What is the url of your dev server? › http://localhost:3000 <-- Change the port to 3000
```

If you want to change any of these settings afterwards, they are available in `src-tauri/tauri.conf.json`

### Optional: Using another port

You can also use another port. Just point the Tauri devPath to the SvelteKit development server.

Set the Tauri devPath in `src-tauri/tauri.conf.json`:
```json
{
  "build": {
    "devPath": "http://localhost:YOUR_PREFERRED_PORT"
  }
}
```

Set the SvelteKit development server port in `package.json`:
```json
{
  "scripts": {
    "dev": "svelte-kit dev -p YOUR_PREFERRED_PORT"
  }
}
```

### Setup Tauri `before` commands

SvelteKit should always start it's dev server or build it's production site before Tauri. Tauri provides an easy way to do this with the `beforeDevCommand` and `beforeBuildCommand`. Update both in `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev"
  }
}
```

### Summary

If you followed all steps then the `build` settings in `src-tauri/tauri.conf.json` should look like this:

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:3000",
    "distDir": "../build"
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

Note that contrast to the CLI this isn't a developer dependency because it's not only a build-stage requirement but a production requirement.

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
npm run tauri dev
```

The first time you run the Tauri app it will generate a `Cargo.lock` file. It's purpose is *"to describe the state of the world at the time of a successful build"* and you should add it to your version control ([source](https://doc.rust-lang.org/cargo/faq.html#why-do-binaries-have-cargolock-in-version-control-but-not-libraries)).

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
npm run tauri build
```

It will detect your operating system and build a bundle accordingly. The result will be located in `src-tauri/target/release`.

For more information about building applications for different platforms check out [the official documentation](https://tauri.app/v1/guides/building/)

## Extra

### Removing the Menu Bar

The generated Tauri project contains a menu bar. To remove it, delete the `.menu` parameter from the Tauri builder in `src-tauri/main.rs`:

```rust
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    // .menu(tauri::Menu::os_default(&context.package_info().name)) <-- remove this line
    .run(context)
    .expect("error while running tauri application");
}
```

### Styling with TailwindCSS

It's possible to add [TailwindCSS](https://tailwindcss.com/) to the SvelteKit project by following the steps outlined [here in the TailwindCSS docs](https://tailwindcss.com/docs/guides/sveltekit). The resulting example project is available [here](https://github.com/Stijn-B/tauri-sveltekit-tailwindcss-example).
