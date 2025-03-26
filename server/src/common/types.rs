use std::sync::Arc;

use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{errors::Clerror, openai::schemas::ChatBotResponse};

#[derive(Clone)]
pub struct AppState {
    pub http_client: Arc<Client>,
}

// ---------- REQUEST TYPES ----------

/// Request sent to the Axum server for the LLM to process.
#[derive(Deserialize, Serialize, Debug)]
pub struct ClaraRequest {
    /// Chat history, including messages from assistant and user.
    pub messages: Vec<Message>,
    /// Current style of webpage, as CSS in plain text.
    pub current_style: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Message {
    pub role: String,
    pub content: String,
    /// Name of the bot or participant.
    pub name: Option<String>,
}

// ---------- RESPONSE TYPES ----------

/// LLM's response sent back from the Axum server
#[derive(Deserialize, Serialize, Debug)]
pub struct ClaraResponse {
    pub content: String,
    /// If the user requested a poem, a new style will be sent back as CSS, otherwise `None` will be sent.
    pub new_style: Option<String>,
}
impl TryFrom<ChatBotResponse> for ClaraResponse {
    type Error = Clerror;

    fn try_from(mut value: ChatBotResponse) -> Result<Self, Self::Error> {
        Ok(serde_json::from_str(
            // OpenAI's chat models are guaranteed to have at least one choice
            value.choices.pop().unwrap().message.content.as_str(),
        )?)
    }
}
