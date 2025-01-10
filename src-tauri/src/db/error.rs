#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq)]
pub enum CommandError {
    BadRequest,
    Validation,
    Database(String),
    Unknown(String),
}

impl From<sqlx::Error> for CommandError {
    fn from(val: sqlx::Error) -> Self {
        let string = val.to_string();

        if let Some(db_err) = val.into_database_error() {
            return CommandError::Database(db_err.message().to_string());
        };

        Self::Unknown(string)
    }
}
