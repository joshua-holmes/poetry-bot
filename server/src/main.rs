use std::{env, sync::Arc};

use axum::{http::HeaderValue, Extension};
use log::info;
use reqwest::Client;
use tower_http::{cors::CorsLayer, services::ServeDir};

mod common;
mod handlers;
mod services;
mod utils;

use common::{errors, types};
use utils::{config, openai};

/// Selected port that the server will run on
const PORT: u16 = 49152;

#[tokio::main]
async fn main() {
    // initialize logging
    env_logger::init();

    // load env vars from .env file
    // SAFETY: This is run on the main thread a single time, so no safety concern with env vars being written while the
    // same env var is being written/read on another thread.
    unsafe {
        config::load_env_vars();
    }

    // set api key and token here, so the server fails fast if they are not right
    let openai_api_key = env::var(openai::API_KEY_ENV_VAR).unwrap_or_else(|_| {
        panic!(
            "Could not find API key at env var: {}",
            openai::API_KEY_ENV_VAR
        )
    });
    openai::TOKEN
        .set(format!("Bearer {}", openai_api_key))
        .unwrap();

    // setup http client for outbound requests
    let http_client = Arc::new(Client::new());

    // setup app
    let cors = CorsLayer::new()
        .allow_origin(HeaderValue::from_str("http://localhost").expect("Failed to setup CORS"));
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", PORT))
        .await
        .unwrap_or_else(|e| panic!("Axum failed to bind to port {}:\n{}", PORT, e));
    let mut app = handlers::build_router()
        .layer(cors)
        .layer(Extension(types::AppState { http_client }));

    // only serve frontend files in release mode
    if !cfg!(debug_assertions) {
        let cwd = env::current_dir()
            .expect("Cannot find the current directory, which is needed to serve frontend files.");
        let static_frontend = config::find_static_frontend(&cwd).expect("Server is trying to serve frontend files because this is running in release mode, but it cannot find `dist/` directory. Either run in non-release mode (if developing) or run `npm run build` to create build files.");
        let div = "------------------------";
        info!("Serving frontend from {:?}", static_frontend);
        info!(
            "Frontend is now available at:\n{}\nhttp://localhost:{}\n{}",
            div, PORT, div
        );
        app = app.fallback_service(ServeDir::new(static_frontend.clone()));
    }

    // run app!
    axum::serve(listener, app)
        .await
        .expect("Failed to start Axum server");
}
