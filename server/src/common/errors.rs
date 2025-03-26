use serde::Serialize;

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
