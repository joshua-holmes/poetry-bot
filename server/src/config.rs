use std::{env, fs, path::PathBuf};

const TARGET: &str = ".env";

/// Reads through project root and server root dirs for .env files
pub fn load_env_vars() {
    for path in ["..", "."] {
        let entries = fs::read_dir(path)
            .unwrap_or_else(|e| panic!("Could not read directory '{}' because:\n{}", path, e));
        for entry in entries {
            let entry = entry.unwrap();
            let fname = entry.file_name();
            let path = entry.path();
            if path.is_dir() {
                continue;
            };
            if fname == TARGET {
                load_env_file(&path);
            }
        }
    }
}

/// Loads env vars from given file
fn load_env_file(path: &PathBuf) {
    let content = fs::read_to_string(path)
        .unwrap_or_else(|e| panic!("Failed to read file '{:?}':\n{}", path, e));

    for line in content.lines() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }

        // Split the line into a key and a value at the first '='
        let mut parts = line.splitn(2, '=');
        if let Some(key) = parts.next() {
            if let Some(value) = parts.next() {
                // Remove leading/trailing whitespace and quotes
                let key = key.trim().to_string().replace("'", "").replace("\"", "");
                let value = value.trim().to_string().replace("'", "").replace("\"", "");
                println!(".env -> {}", key);
                env::set_var(key, value);
            }
        }
    }
}
