![Tauri x SvelteKit Banner](/readme_assets/banner.png)

# Tauri x SvelteKit

1. [Getting Started](#getting-started)
2. [How it Works](#how-it-works)
3. [About the Frameworks](#about-the-frameworks)
4. [Desktop Apps with SvelteKit and Tauri - Step-by-Step Tutorial](#desktop-apps-with-sveltekit-and-tauri---step-by-step-tutorial)
5. [Extra](#extra)

## Getting Started

**Install the packages**

```shell
npm install
```

**Specify your application identifier**

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

**Run the Tauri app**

For development, run the following command:

```shell
npm run dev
```

**Build the Tauri app**

For building the app into a distributable package, run the following command:

```shell
npm run build
```

**The initial app should look like this:**

![Screenshot of the Tauri app](/readme_assets/application-screenshot.png)

## How it works

Tauri can integrate any frontend framework that compiles to HTML, JS and CSS. SvelteKit can be configured to build a static website (compile to HTML, JS and CSS) using the [@sveltejs/adapter-static adapter](https://kit.svelte.dev/docs/adapter-static). This enables us to use Tauri with SvelteKit.

> [!IMPORTANT]  
> When using SvelteKit as a static site generator, some of it's features like server-side rendering (SSR) and server endpoints are not available. This is because static site generators are designed to generate static websites that can be hosted on a server or a content delivery network (CDN). There is no server involved in the process of serving the website to the user. Instead, the website is pre-built and served as a collection of static files. This limitation is exactly what makes it possible to integrate SvelteKit with Tauri this way.

## About the frameworks

[**Tauri**](https://tauri.app/) is a framework for building tiny, blazing fast binaries for all major desktop platforms. Developers can integrate any frontend framework that compiles to HTML, JS and CSS for building their user interface. Tauri places a great emphasis on [security](https://tauri.app/security/). You can check out how the Tauri architecture works and get a grasp on how the different components integrate [here](https://tauri.app/concept/architecture/).

[**SvelteKit**](https://kit.svelte.dev/) is an application framework powered by Svelte which applies a new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app. Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically updates the DOM when the state of your app changes which results in better performance.

## Desktop Apps with SvelteKit and Tauri - Step-by-Step Tutorial

The [TUTORIAL.md](/TUTORIAL.md) file contains a step-by-step guide on how to manually create a desktop application with Tauri and SvelteKit. It can be a usefull resource when you want to turn your existing SvelteKit project into a desktop app, or when you want to add SvelteKit to your existing Tauri project.

> [!NOTE]  
> Clone this repository to get the final result of the tutorial.

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
