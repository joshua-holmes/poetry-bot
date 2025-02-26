use serde::{Deserialize, Serialize};

// REQUEST TYPES
//
/// Request sent to the Axum server for the LLM to process.
#[derive(Deserialize, Serialize, Debug)]
pub struct ClaraRequest {
    /// Chat history, including messages from assistant and user.
    messages: Vec<Message>,
    /// Current style of webpage, as CSS in plain text.
    current_style: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Message {
    role: String,
    text: String,
}

// RESPONSE TYPES
//
/// LLM's response sent back from the Axum server
#[derive(Deserialize, Serialize, Debug)]
pub struct ClaraResponse {
    /// Message response from the LLM to the user.
    message_text: String,
    /// If the user requested a poem, a new style will be sent back as CSS, otherwise `None` will be sent.
    new_style: Option<String>,
}

// ERROR TYPES
//
/// A Clara error! Yeah you're right, it's a bad name... General error type to send back to the client
#[derive(Serialize, Debug)]
pub struct Clerror {
    pub error: String,
}
impl<T> From<T> for Clerror
where
    T: ToString,
{
    fn from(value: T) -> Self {
        Self {
            error: value.to_string(),
        }
    }
}
