use std::{
    env, fs,
    path::{Path, PathBuf},
};

use log::info;

const TARGET: &str = ".env";

/// Reads through project root and server root dirs for .env files.
///
/// # Safety
/// This function can set an OS env var, which is not safe if you cannot guarantee that another thread is not doing the
/// same thing at the same time.
pub unsafe fn load_env_vars() {
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
                unsafe { load_env_file(&path) };
            }
        }
    }
}

/// Loads env vars from given file.
///
/// # Safety
/// This function can set an OS env var, which is not safe if you cannot guarantee that another thread is not doing the
/// same thing at the same time.
unsafe fn load_env_file(path: &PathBuf) {
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
                info!(".env -> {}", key);
                unsafe {
                    env::set_var(key, value);
                }
            }
        }
    }
}

/// Searches this dir and one dir up for the `dist/` directory, which contains the static frontend
pub fn find_static_frontend(path: &Path) -> Option<PathBuf> {
    // we look in parent dir in case the user runs this server from the `server/` dir
    for dir in [Some(path), path.parent()].into_iter().flatten() {
        if fs::exists(dir.join("dist/index.html")).unwrap_or(false) {
            return Some(dir.join("dist"));
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{env::temp_dir, fs};

    #[test]
    fn test_load_env_file() {
        let path = "./.test_load_env_file.env";
        let env_var = "TEST_LOAD_ENV_FILE";

        fs::write(path, "TEST_LOAD_ENV_FILE=success").unwrap();
        assert!(env::var(env_var).is_err());

        unsafe {
            load_env_file(&PathBuf::from(path));
        }

        assert!(env::var(env_var).is_ok());
        assert_eq!(env::var(env_var).unwrap(), "success");

        fs::remove_file(path).unwrap();
    }

    #[test]
    fn test_comments_are_ignored() {
        let path = "./.test_comments_are_ignored.env";
        let env_var = "TEST_COMMENTS_ARE_IGNORED";

        fs::write(path, " #TEST_COMMENTS_ARE_IGNORED=success").unwrap();
        assert!(env::var(env_var).is_err());

        unsafe {
            load_env_file(&PathBuf::from(path));
        }

        assert!(env::var(env_var).is_err());

        fs::remove_file(path).unwrap();
    }

    #[test]
    fn test_single_quotes_are_ignored() {
        let path = "./.test_single_quotes_are_ignored.env";
        let env_var = "TEST_SINGLE_QUOTES_ARE_IGNORED";

        fs::write(path, "TEST_SINGLE_QUOTES_ARE_IGNORED='success'").unwrap();
        assert!(env::var(env_var).is_err());

        unsafe {
            load_env_file(&PathBuf::from(path));
        }

        assert_eq!(env::var(env_var).unwrap(), "success");

        fs::remove_file(path).unwrap();
    }

    #[test]
    fn test_double_quotes_are_ignored() {
        let path = "./.test_double_quotes_are_ignored.env";
        let env_var = "TEST_DOUBLE_QUOTES_ARE_IGNORED";

        fs::write(path, "TEST_DOUBLE_QUOTES_ARE_IGNORED=\"success\"").unwrap();
        assert!(env::var(env_var).is_err());

        unsafe {
            load_env_file(&PathBuf::from(path));
        }

        assert_eq!(env::var(env_var).unwrap(), "success");

        fs::remove_file(path).unwrap();
    }

    #[test]
    fn test_still_runs_with_junk() {
        let path = "./.test_still_runs_with_junk.env";

        fs::write(path, "some weird text").unwrap();

        unsafe {
            load_env_file(&PathBuf::from(path));
        }

        fs::remove_file(path).unwrap();
    }

    #[test]
    fn test_find_static_frontend_in_current_dir() {
        // Create a temporary directory structure for testing
        let temp_dir = temp_dir();

        // Create special dir for this test
        let test_dir = temp_dir.join("test_find_static_frontend_in_current_dir");
        fs::remove_dir_all(&test_dir).unwrap_or(());
        fs::create_dir(&test_dir).unwrap();

        // Create dir we are looking for
        let dist_dir = test_dir.join("dist");
        fs::create_dir(&dist_dir).unwrap();

        // Create index.html file in dist directory
        let index_file = dist_dir.join("index.html");
        fs::File::create(&index_file).unwrap();

        // Test finding static frontend in dist directory
        assert_eq!(find_static_frontend(&test_dir), Some(dist_dir.clone()));

        // Cleanup
        fs::remove_dir_all(&test_dir).unwrap_or(());
    }

    #[test]
    fn test_find_static_frontend_in_parent_dir() {
        // Create a temporary directory structure for testing
        let temp_dir = temp_dir();

        // Create special dir for this test
        let test_dir = temp_dir.join("test_find_static_frontend_in_parent_dir");
        fs::remove_dir_all(&test_dir).unwrap_or(());
        fs::create_dir(&test_dir).unwrap();

        // Create dir we are looking for
        let dist_dir = test_dir.join("dist");
        fs::create_dir(&dist_dir).unwrap();

        // Create index.html file in dist directory
        let index_file = dist_dir.join("index.html");
        fs::File::create(&index_file).unwrap();

        // Create child dir to search from
        let child_dir = test_dir.join("child");

        // Test finding static frontend in dist directory
        assert_eq!(find_static_frontend(&child_dir), Some(dist_dir.clone()));

        // Cleanup
        fs::remove_dir_all(&test_dir).unwrap_or(());
    }

    #[test]
    fn test_do_not_find_static_frontend() {
        // Create a temporary directory structure for testing
        let temp_dir = temp_dir();

        // Create special dir for this test
        let test_dir = temp_dir.join("test_do_not_find_static_frontend");
        fs::remove_dir_all(&test_dir).unwrap_or(());
        fs::create_dir(&test_dir).unwrap();

        // Create child dir to search from
        let child_dir = test_dir.join("child");

        // Test finding static frontend in dist directory
        assert_eq!(find_static_frontend(&child_dir), None);

        // Cleanup
        fs::remove_dir_all(&test_dir).unwrap_or(());
    }
}
