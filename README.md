# Spotify Web Wrapper

Simple Spotify web wrapper with a minimal design and interface written with [SvelteKit](https://kit.svelte.dev/).

## How is this project created 🛠️

This project is created with [SvelteKit](https://kit.svelte.dev/) with [Vite](https://vitejs.dev/) for fast development & building. For setting up SvelteKit with Vite, I used the commands below:

```bash
npm create svelte@latest .
```

After executing this command, your command line will ask some questions.

```bash
> √ Which Svelte app template? » Skeleton project
> √ Add type checking with TypeScript? » Yes, using TypeScript syntax
> √ Add ESLint for code linting? ... No / *Yes*
> √ Add Prettier for code formatting? ... No / *Yes*
> √ Add Playwright for browser testing? ... No / *Yes*
> √ Add Vitest for unit testing? ... No / *Yes*
```

Now you can work on your Svelte application which is set up in your current working directory.

## Run Locally 🧱

The first step is cloning the repository on your local machine. This will create a new folder which includes the source code from the repository.

```bash
git clone https://github.com/HalloSouf/spotify-web-wrapper.git
```

Navigate through your CLI to the directory which is created by git.

```bash
cd spotify-web-wrapper
```

Install the required dependencies listed in the `package.json` file.

```bash
yarn install
```

Start your Sveltekit application by running the dev command.

```bash
yarn run dev -- --open
```

## Deployment 📦

To deploy your application on a production environment, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

You can preview the production build with `yarn run preview`.

## License 📜

[MIT](https://choosealicense.com/licenses/mit/)
