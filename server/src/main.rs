use std::env;

use axum::{
    http::{HeaderValue, StatusCode}, response::{IntoResponse, Response}, routing::{get, post}, Json, Router
};
use log::{info, warn};
use tower_http::{cors::CorsLayer, services::ServeDir};

mod config;
mod openai;
mod schemas;
mod services;

use schemas::ClaraRequest;
use services::ask_clara;

/// Selected port that the server will run on
const PORT: u16 = 49152;

#[tokio::main]
async fn main() {
    // initialize logging
    env_logger::init();

    // load env vars from .env file
    config::load_env_vars();

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

    // setup app
    let cors = CorsLayer::new()
        .allow_origin(HeaderValue::from_str("http://localhost").expect("Failed to setup CORS"));
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", PORT))
        .await
        .unwrap_or_else(|e| panic!("Axum failed to bind to port {}:\n{}", PORT, e));
    let mut app = Router::new()
        .route("/api", post(api))
        .route("/ping", get(ping))
        .layer(cors);

    // serve frontend, if found (though not necessary because another server could serve it instead, such as a dev server)
    let mut serving_fe = false;
    if let Ok(cwd) = env::current_dir() {
        if let Some(static_frontend) = config::find_static_frontend(&cwd) {
            let div = "------------------------";
            info!("Serving frontend from {:?}", static_frontend);
            info!("Frontend is now available at:\n{}\nhttp://localhost:{}\n{}", div, PORT, div);
            app = app.fallback_service(ServeDir::new(static_frontend.clone()));
            serving_fe = true;
        }
    }
    if !serving_fe {
        warn!("Frontend is not served from this server");
    }

    // run app!
    axum::serve(listener, app)
        .await
        .expect("Failed to start Axum server");
}

async fn api(Json(payload): Json<ClaraRequest>) -> (StatusCode, Response) {
    match ask_clara(payload).await {
        Ok(resp) => (StatusCode::OK, Json(resp).into_response()),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, Json(err).into_response()),
    }
}

async fn ping() -> (StatusCode, &'static str) {
    (StatusCode::OK, "Pong!")
}
