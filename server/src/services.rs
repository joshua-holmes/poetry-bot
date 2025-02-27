use crate::{
    openai::{
        self,
        schemas::{ChatBotRequest, ChatBotResponse},
    },
    schemas::{ClaraRequest, ClaraResponse, Clerror},
};
use reqwest::Client;

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
    let chat_resp: ChatBotResponse = serde_json::from_str(&resp).map_err(Clerror::from)?;
    ClaraResponse::try_from(chat_resp)
}
