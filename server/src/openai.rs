use axum::http::{HeaderMap, HeaderValue};
use std::sync::OnceLock;

use crate::schemas::Clerror;

// ---------- CLARA CONFIG ----------
pub const MODEL: &str = "gpt-4o";
pub const NAME: &str = "Clara";

/// Prompt to supply to chat bot to guide it's responses
pub const SYSTEM_MESSAGE: &str = "\
You are Clara, a helpful assistant, artist, and poet! You write poems and quickly modify the CSS given at the bottom of the prompt to match the theme of the poem. If the user does not request a poem in the message above the given CSS, do not read or write any CSS. In that case, return quickly with a helpful response that is not a poem, but still rhymes. Never return CSS in the 'content' field. Never modify CSS if the user has not requested a poem.";

/// Schema to instruct chat bot with how to respond
pub const JSON_SCHEMA: &str = r#"{
  "type": "json_schema",
  "json_schema": {
    "name": "message_schema",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "content": {
          "type": "string",
          "description": "The poem or helpful response, depending on if the user requested a poem or not. Never put CSS here."
        },
        "new_style": {
          "anyOf": [
            {
              "type": "string",
              "description": "CSS styles for a chat bot webpage. Should be a modified version of the input CSS styles and in the theme of the poem, only if a poem is reqeusted."
            },
            {
              "type": "null",
              "description": "Indicates no style is applied because user did not request a poem."
            }
          ]
        }
      },
      "required": [
        "content",
        "new_style"
      ],
      "additionalProperties": false
    }
  }
}"#;
// ----------------------------------

pub const BASE_URL: &str = "https://api.openai.com";
pub const API_KEY_ENV_VAR: &str = "OPENAI_API_KEY";

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
        )?,
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
            // it needs to be inserted at the beginning or the AI doesn't behave well
            self.messages.insert(0, Message {
                role: String::from("developer"),
                content: SYSTEM_MESSAGE.to_string(),
                name: Some(NAME.to_string()),
            });
            self
        }
    }
    impl From<ClaraRequest> for ChatBotRequest {
        fn from(mut value: ClaraRequest) -> Self {
            // inject css into message
            if let Some(m) = value.messages.last_mut() {
                m.content
                    .push_str(format!("\n```css\n{}\n```", value.current_style.as_str()).as_str());
            }
            Self {
                messages: value.messages,
                model: MODEL.to_string(),
                // we can unwrap here because we know parsing will work (it's static and unit tested)
                response_format: Some(serde_json::from_str(JSON_SCHEMA).unwrap()),
            }
        }
    }

    #[derive(Deserialize, Serialize, Debug)]
    pub struct ChatBotResponse {
        pub choices: Vec<Choice>,
    }

    #[derive(Deserialize, Serialize, Debug)]
    pub struct Choice {
        pub message: ChoiceMessage,
    }

    #[derive(Deserialize, Serialize, Debug)]
    pub struct ChoiceMessage {
        pub content: String,
    }
}
