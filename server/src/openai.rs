use std::sync::OnceLock;
use axum::http::{HeaderMap, HeaderValue};

use crate::schemas::Clerror;

pub const BASE_URL: &str = "https://api.openai.com";
pub const API_KEY_ENV_VAR: &str = "OPENAI_API_KEY";

pub const MODEL: &str = "gpt-4o";
pub const NAME: &str = "Clara";

/// Prompt to supply to chat bot to guide it's responses
pub const SYSTEM_MESSAGE: &str = "\
You are Clara, a helpful assistant, artist, and poet! If the user requests a poem, you write a poem and read the CSS properties in the provided file. Aggressively modify the CSS properties and send the modified CSS back to the user, with the generated poem. If the user did not request a poem, return a helpful response that is not a poem, but still rhymes.";

/// Schema to instruct chat bot with how to respond
pub const JSON_SCHEMA: &str = r#"{
  "name": "message_schema",
  "strict": true,
  "schema": {
    "type": "object",
    "properties": {
      "message_text": {
        "type": "string",
        "description": "The poem or helpful response, depending on if the user requested a poem or not."
      },
      "new_style": {
        "anyOf": [
          {
            "type": "string",
            "description": "CSS styles for a chat bot webpage. Should be a modified version of the input CSS styles and in the theme of the poem."
          },
          {
            "type": "null",
            "description": "Indicates no style is applied because user did not request a poem."
          }
        ]
      }
    },
    "required": [
      "message_text",
      "new_style"
    ],
    "additionalProperties": false
  }
}"#;

// run-time known
pub static TOKEN: OnceLock<String> = OnceLock::new();

pub fn build_headers() -> Result<HeaderMap, Clerror> {
    let mut headers = HeaderMap::new();
    headers.insert(
        "Authorization",
        HeaderValue::from_str(
            TOKEN
                .get()
                .ok_or(Clerror::from("OpenAi token not initialized"))?,
        )
        .map_err(Clerror::from)?,
    );
    headers.insert("Content-Type", HeaderValue::from_static("application/json"));
    headers.insert("Accept", HeaderValue::from_static("application/json"));
    Ok(headers)
}

pub mod urls {
    use super::*;

    // for compile-time string formatting
    use const_format::formatcp;

    pub const CHAT: &str = formatcp!("{}/v1/chat/completions", BASE_URL);
}

pub mod schemas {
    use super::*;
    use crate::schemas::{ClaraRequest, Message};
    use serde::{Deserialize, Serialize};

    // There are more properties on these types, but these are the ones we need.
    // See openai's docs for more:
    // https://platform.openai.com/docs/api-reference/chat/object

    #[derive(Deserialize, Serialize, Debug)]
    pub struct ChatBotRequest {
        pub messages: Vec<Message>,
        pub model: String,
        pub response_format: Option<serde_json::Value>,
    }
    impl ChatBotRequest {
        pub fn configure(mut self) -> Self {
            self.messages.push(Message {
                role: String::from("developer"),
                content: SYSTEM_MESSAGE.to_string(),
                name: Some(NAME.to_string()),
            });
            self
        }
    }
    impl From<ClaraRequest> for ChatBotRequest {
        fn from(value: ClaraRequest) -> Self {
            Self {
                messages: value.messages,
                model: MODEL.to_string(),
                // we can unwrap here because we know parsing will work (it's static and unit tested)
                response_format: Some(serde_json::from_str(JSON_SCHEMA).unwrap()),
            }
        }
    }
}
