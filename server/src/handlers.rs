use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Extension, Json, Router,
};

use crate::{common::types::ClaraRequest, services::ask_clara, AppState};

pub fn build_router() -> Router {
    Router::new()
        .route("/api", post(api))
        .route("/ping", get(ping))
}

async fn api(
    Extension(state): Extension<AppState>,
    Json(payload): Json<ClaraRequest>,
) -> (StatusCode, Response) {
    match ask_clara(state.http_client, payload).await {
        Ok(resp) => (StatusCode::OK, Json(resp).into_response()),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, Json(err).into_response()),
    }
}

async fn ping() -> (StatusCode, &'static str) {
    (StatusCode::OK, "Pong!")
}
