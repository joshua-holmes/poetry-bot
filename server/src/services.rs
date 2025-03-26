use std::sync::Arc;

use crate::{
    errors::Clerror,
    openai::{
        self,
        schemas::{ChatBotRequest, ChatBotResponse},
    },
    types::{ClaraRequest, ClaraResponse},
};
use reqwest::Client;

/// Ask Clara LLM for response to inputs
pub async fn ask_clara(
    http_client: Arc<Client>,
    clara_request: ClaraRequest,
) -> Result<ClaraResponse, Clerror> {
    // call clara 📞
    call_openai(http_client, ChatBotRequest::from(clara_request).configure()).await
}

async fn call_openai(
    http_client: Arc<Client>,
    body: ChatBotRequest,
) -> Result<ClaraResponse, Clerror> {
    let body = serde_json::to_string(&body)?;
    let resp = http_client
        .post(openai::urls::CHAT)
        .headers(openai::build_headers()?)
        .body(body)
        .send()
        .await?
        .error_for_status()?
        .text()
        .await?;
    let chat_resp: ChatBotResponse = serde_json::from_str(&resp).map_err(Clerror::from)?;
    ClaraResponse::try_from(chat_resp)
}
