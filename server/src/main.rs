use axum::{
    http::{HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
mod schemas;
use schemas::ClaraRequest;

mod services;
use services::ask_clara;
use tower_http::cors::CorsLayer;

/// Selected port that the server will run on
const PORT: u16 = 3000;

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(HeaderValue::from_str("http://localhost").expect("Failed to setup CORS"));
    let app = Router::new()
        .route("/api", post(api))
        .route("/ping", get(ping))
        .layer(cors);
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", PORT))
        .await
        .unwrap_or_else(|e| panic!("Axum failed to bind to port {}:\n{}", PORT, e));

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
