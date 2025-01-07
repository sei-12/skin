#[derive(serde::Serialize, serde::Deserialize,Debug,)]
pub enum CommandError {
    Other    
}

impl From<sqlx::Error> for CommandError {
    fn from(_: sqlx::Error) -> Self {
        Self::Other
    }
}