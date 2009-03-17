//! VON is Spark's human-editable meta-file format.
//!
//! It represents nulls, booleans, signed 64-bit integers, strings, arrays, and
//! string-keyed objects. The format intentionally has no runtime, scene, or
//! database-schema semantics: callers own the meaning of each document.
#[cfg(feature = "serde")]
mod deserializer;
#[cfg(feature = "serde")]
mod error;
#[cfg(feature = "serde")]
mod format;
#[cfg(feature = "serde")]
mod serializer;

pub use von_ast::VonValue;
pub use von_parser::{
    Lexer, Token, TokenKind, VonCstElement, VonCstParser, VonCstRoot, VonParseError, VonParser,
};

#[cfg(feature = "serde")]
pub use deserializer::{VonDeserializer, from_str, from_value};
#[cfg(feature = "serde")]
pub use error::{VonError, VonSerdeError};
#[cfg(feature = "serde")]
pub use format::{to_string, to_string_indented};
#[cfg(feature = "serde")]
pub use serializer::{VonSerializer, to_value};
