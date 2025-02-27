# Meet Clara, the AI Poet and Artist

![image](./images/clara.png)

Clara is an AI chat bot that responds in rhymes and can generate poems! When a poem is generated, the bot will dynamically change the theme of this page to reflect the theme of the poem.

## Try it out!

### API Key
To run this app locally, you will need an OpenAI API key with chat completion permissions.

![image](./images/tutorial.png)

Once you have an API key, set the environment variable `OPENAI_API_KEY` to the value of the API key. You can do this any way you like, but this repo does support `.env` files in both `.env` and `server/.env` locations, so you could set it up like this if that's easier:
```bash
echo 'OPENAI_API_KEY=<paste-token-here>' > .env
```

### Dependencies
This is a mono repo with a backend and frontend service.

#### Frontend
You will need `npm` to install dependencies. In this directory, run `npm install`.

#### Backend
You will need `cargo` for the backend dependencies. That's it :)

### Running
Now that you have dependencies installed, run just this one command to boot up both the frontend and the backend: `npm run dev`

That's it! Now visit `http://localhost:5173` in a browser! Have fun!

### Testing
To test the frontend, run `npm test` in this directory. To test the backend, navigate to the `server/` directory and run `cargo test`.


## Features
- Basic AI chat features, but Clara always speaks in rhymes!
- Clara, when prompted, will write a poem and change the theme of the chat bot webpage to match the poem's theme
- Themes can be saved across sessions! Just click the "Save Theme" button when you are not on the default theme, then refresh. The theme will still be there. This is saved using the browser's local storage feature.

## Known Deficiencies
The model runs slow when asking it for a poem, because of the size of the CSS file it needs to process to generate new styles. It's much faster if you just chat with it and don't ask for a poem. Still thinking of ways around the speed issue.

There is no image uploading feature.
