use reqwest::Client;
use crate::{
    openai,
    openai::schemas::ChatBotRequest,
    schemas::{ClaraRequest, ClaraResponse, Clerror},
};

/// Ask Clara LLM for response to inputs
pub async fn ask_clara(clara_request: ClaraRequest) -> Result<ClaraResponse, Clerror> {
    // call clara 📞
    call_openai(ChatBotRequest::from(clara_request).configure()).await
}

async fn call_openai(body: ChatBotRequest) -> Result<ClaraResponse, Clerror> {
    let body = serde_json::to_string(&body)?;
    let resp = Client::new()
        .post(openai::urls::CHAT)
        .headers(openai::build_headers()?)
        .body(body)
        .send()
        .await?
        .error_for_status()?
        .text()
        .await?;
    serde_json::from_str(&resp).map_err(Clerror::from)
}
