use reqwest::Client;
use crate::schemas::{ClaraRequest, ClaraResponse, Clerror};

/// Ask Clara LLM for response to inputs
pub async fn ask_clara(clara_request: ClaraRequest) -> Result<ClaraResponse, Clerror> {
    // serialize request
    let body = serde_json::to_string(&clara_request)
        .map_err(Clerror::from)?;
    // call clara 📞
    let response = call_magic_loops(body).await?;
    // deseriealize response
    serde_json::from_str(&response)
        .map_err(Clerror::from)
}

async fn call_magic_loops(body: String) -> Result<String, Clerror> {
    let client = Client::new();
    client
        .post("https://magicloops.dev/api/loop/da2f21c8-dfea-401d-82ae-ea4d17a8367a/run")
        .body(body)
        .send()
        .await
        .map_err(Clerror::from)?
        .text()
        .await
        .map_err(Clerror::from)
}
