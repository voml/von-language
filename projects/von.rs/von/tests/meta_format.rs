use serde::{Deserialize, Serialize};
use von::{VonParser, from_str, to_string_indented};

#[derive(Debug, Deserialize, PartialEq, Serialize)]
struct SparkProjectMeta {
    format: String,
    version: i64,
    name: String,
    scenes: Vec<String>,
}

#[test]
fn spark_meta_round_trips_through_canonical_von() {
    let meta = SparkProjectMeta {
        format: "spark.project".to_owned(),
        version: 1,
        name: "Starter Game".to_owned(),
        scenes: vec!["scenes/main.scene.von".to_owned()],
    };

    let source = to_string_indented(&meta).expect("meta serializes");
    assert_eq!(
        source,
        "{\n  format: \"spark.project\",\n  name: \"Starter Game\",\n  scenes: [\n    \"scenes/main.scene.von\"\n  ],\n  version: 1\n}"
    );
    assert_eq!(
        VonParser::parse(&source).expect("canonical source parses"),
        VonParser::parse(&source).unwrap()
    );
    assert_eq!(
        from_str::<SparkProjectMeta>(&source).expect("meta deserializes"),
        meta
    );
}

#[test]
fn comments_and_unquoted_meta_keys_parse() {
    let source = "# Spark project metadata\n{ format: spark.project, version: 1, enabled: true }";
    let value = VonParser::parse(source).expect("VON parses");
    assert_eq!(
        value.as_object().unwrap().get("format").unwrap().as_str(),
        Some("spark.project")
    );
}
