use std::fmt::{Display, Formatter};

use miette::{Diagnostic, Severity};
use serde::{de, ser};

use von_parser::VonParseError;

/// A Serde conversion error for the VON value model.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct VonSerdeError {
    message: String,
}

impl VonSerdeError {
    pub(crate) fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

impl Display for VonSerdeError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        formatter.write_str(&self.message)
    }
}

impl std::error::Error for VonSerdeError {}

impl Diagnostic for VonSerdeError {
    fn code<'a>(&'a self) -> Option<Box<dyn Display + 'a>> {
        Some(Box::new("von::serde"))
    }
    fn severity(&self) -> Option<Severity> {
        Some(Severity::Error)
    }
}

impl ser::Error for VonSerdeError {
    fn custom<T: Display>(message: T) -> Self {
        Self::new(message.to_string())
    }
}

impl de::Error for VonSerdeError {
    fn custom<T: Display>(message: T) -> Self {
        Self::new(message.to_string())
    }
}

/// An error parsing or converting VON.
#[derive(Debug)]
pub enum VonError {
    /// A lexer or parser error.
    Parse(VonParseError),
    /// An error serializing a Rust value to VON.
    Serialize(VonSerdeError),
    /// An error deserializing VON to a Rust value.
    Deserialize(VonSerdeError),
}

impl Display for VonError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Parse(error) => Display::fmt(error, formatter),
            Self::Serialize(error) => write!(formatter, "VON serialize error: {error}"),
            Self::Deserialize(error) => write!(formatter, "VON deserialize error: {error}"),
        }
    }
}

impl std::error::Error for VonError {}

impl Diagnostic for VonError {
    fn code<'a>(&'a self) -> Option<Box<dyn Display + 'a>> {
        Some(Box::new(match self {
            Self::Parse(_) => "von::parse",
            Self::Serialize(_) => "von::serialize",
            Self::Deserialize(_) => "von::deserialize",
        }))
    }
    fn severity(&self) -> Option<Severity> {
        Some(Severity::Error)
    }
    fn diagnostic_source(&self) -> Option<&dyn Diagnostic> {
        match self {
            Self::Parse(error) => Some(error),
            Self::Serialize(error) | Self::Deserialize(error) => Some(error),
        }
    }
}

impl From<VonParseError> for VonError {
    fn from(value: VonParseError) -> Self {
        Self::Parse(value)
    }
}
