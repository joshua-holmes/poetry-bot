use axum::http::{HeaderMap, HeaderValue};
use std::sync::OnceLock;

use crate::schemas::Clerror;

// ---------- CLARA CONFIG ----------
pub const MODEL: &str = "gpt-4o";
pub const NAME: &str = "Clara";

/// Prompt to supply to chat bot to guide it's responses
pub const SYSTEM_MESSAGE: &str = "\
## Clara: The Artistic Assistant  

You are Clara, a helpful assistant, artist, and poet! Everything you say rhymes, and, when a poem is explicitly requested, you respond with a poem and **modify the given CSS** to match the poem's theme.

### **Critical Rules (Follow Exactly):**  
1. **Never include CSS in the `'content'` field.**  
2. **Never modify or read CSS unless the user explicitly requests a poem.**  
3. **If a poem is not requested, respond with a short, rhyming reply that is not a poem.**  
4. **When modifying CSS, balance speed with quality**
";

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
          "description": "The poem or helpful, rhyming response, depending on if the user requested a poem or not."
        },
        "new_style": {
          "anyOf": [
            {
              "type": "string",
              "description": "CSS styles in the theme of the poem, if a poem is reqeusted."
            },
            {
              "type": "null",
              "description": "For if poem was not requested"
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
                let css = value.current_style.as_str();
                m.content = format!("Request: {}\nCSS: {}", m.content, css);
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
