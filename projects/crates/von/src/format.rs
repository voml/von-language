//! Canonical VON text formatting for Spark meta files.

use std::fmt::Write;

use serde::Serialize;

use crate::{VonError, VonValue, to_value};

/// Serializes a value to compact, deterministic VON text.
pub fn to_string<T>(value: &T) -> Result<String, VonError>
where
    T: Serialize,
{
    let value = to_value(value)?;
    Ok(format_value(&value, None, 0))
}

/// Serializes a value to deterministic, two-space-indented VON text.
pub fn to_string_indented<T>(value: &T) -> Result<String, VonError>
where
    T: Serialize,
{
    let value = to_value(value)?;
    Ok(format_value(&value, Some(2), 0))
}

fn format_value(value: &VonValue, indent: Option<usize>, depth: usize) -> String {
    match value {
        VonValue::Null => "null".to_owned(),
        VonValue::Bool(value) => value.to_string(),
        VonValue::Number(value) => value.to_string(),
        VonValue::String(value) => quote(value),
        VonValue::Array(values) => format_array(values, indent, depth),
        VonValue::Object(entries) => format_object(entries, indent, depth),
    }
}

fn format_array(values: &[VonValue], indent: Option<usize>, depth: usize) -> String {
    if values.is_empty() {
        return "[]".to_owned();
    }
    match indent {
        None => format!(
            "[{}]",
            values
                .iter()
                .map(|value| format_value(value, None, depth))
                .collect::<Vec<_>>()
                .join(",")
        ),
        Some(width) => {
            let prefix = " ".repeat(width * (depth + 1));
            let suffix = " ".repeat(width * depth);
            format!(
                "[\n{}\n{}]",
                values
                    .iter()
                    .map(|value| format!("{prefix}{}", format_value(value, indent, depth + 1)))
                    .collect::<Vec<_>>()
                    .join(",\n"),
                suffix
            )
        }
    }
}

fn format_object(
    entries: &std::collections::BTreeMap<String, VonValue>,
    indent: Option<usize>,
    depth: usize,
) -> String {
    if entries.is_empty() {
        return "{}".to_owned();
    }
    match indent {
        None => format!(
            "{{{}}}",
            entries
                .iter()
                .map(|(key, value)| format!(
                    "{}:{}",
                    format_key(key),
                    format_value(value, None, depth)
                ))
                .collect::<Vec<_>>()
                .join(",")
        ),
        Some(width) => {
            let prefix = " ".repeat(width * (depth + 1));
            let suffix = " ".repeat(width * depth);
            format!(
                "{{\n{}\n{}}}",
                entries
                    .iter()
                    .map(|(key, value)| format!(
                        "{prefix}{}: {}",
                        format_key(key),
                        format_value(value, indent, depth + 1)
                    ))
                    .collect::<Vec<_>>()
                    .join(",\n"),
                suffix
            )
        }
    }
}

fn format_key(key: &str) -> String {
    if is_identifier(key) && !matches!(key, "null" | "true" | "false") {
        key.to_owned()
    } else {
        quote(key)
    }
}

fn is_identifier(key: &str) -> bool {
    let mut chars = key.chars();
    chars.next().is_some_and(von_parser::is_identifier_start)
        && chars.all(von_parser::is_identifier_continue)
}

fn quote(value: &str) -> String {
    let mut output = String::with_capacity(value.len() + 2);
    output.push('"');
    for ch in value.chars() {
        match ch {
            '"' => output.push_str("\\\""),
            '\\' => output.push_str("\\\\"),
            '\n' => output.push_str("\\n"),
            '\r' => output.push_str("\\r"),
            '\t' => output.push_str("\\t"),
            _ => output
                .write_char(ch)
                .expect("writing to String cannot fail"),
        }
    }
    output.push('"');
    output
}
