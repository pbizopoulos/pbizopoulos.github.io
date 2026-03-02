use clap::Parser;
use git2::{Repository, StatusOptions};
use regex::Regex;
use std::collections::HashSet;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(default_value = ".")]
    dir_name: String,

    #[arg(short, long)]
    fix: bool,
}

fn is_valid_fqdn(name: &str) -> bool {
    // Simple FQDN check: labels separated by dots, at least two labels, etc.
    // Following a basic pattern for simplicity.
    let re = Regex::new(r"^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$").unwrap();
    re.is_match(name)
}

fn is_dash_case(name: &str) -> bool {
    let re = Regex::new(r"^[a-z0-9]+([-.][a-z0-9]+)*$").unwrap();
    re.is_match(name)
}

fn main() {
    let args = Args::parse();
    if std::env::var("DEBUG").as_deref() == Ok("1") {
        run_tests();
    } else {
        check_repository_directory_structure(args.dir_name, args.fix);
    }
}

fn check_repository_directory_structure(dir_name: String, fix: bool) {
    let mut warnings = Vec::new();
    let dir_path = Path::new(&dir_name).canonicalize().expect("Failed to canonicalize path");
    let repo = Repository::discover(&dir_path).expect("Not a git repository");
    let working_dir = repo.workdir().expect("No working directory for repository");

    if fix {
        let output = std::process::Command::new("git")
            .args(["clean", "-df"])
            .current_dir(working_dir)
            .output()
            .expect("Failed to execute git clean");
        if !output.stdout.is_empty() {
            print!("{}", String::from_utf8_lossy(&output.stdout));
        }
    } else {
        let mut status_options = StatusOptions::new();
        status_options.include_untracked(true);
        let statuses = repo.statuses(Some(&mut status_options)).expect("Failed to get statuses");
        for entry in statuses.iter() {
            if entry.status().is_wt_new() {
                warnings.push(format!("{}/{}: is untracked", working_dir.display(), entry.path().unwrap()));
            }
        }
    }

    let head = repo.head().expect("Failed to get HEAD");
    let branch_name = head.shorthand().expect("Failed to get branch name");
    if branch_name != "main" {
        warnings.push(format!("{}: should have 'main' as the active branch", working_dir.display()));
    }

    let branches = repo.branches(None).expect("Failed to get branches");
    if branches.count() != 1 {
        warnings.push(format!("{}: should have only one branch", working_dir.display()));
    }

    let dir_name_str = working_dir.file_name().unwrap().to_str().unwrap();
    if dir_name_str == dir_name_str.to_lowercase()
        && !is_valid_fqdn(dir_name_str)
        && !is_dash_case(dir_name_str)
    {
        warnings.push(format!("{}: should be lower-case and valid FQDN or in dash-case", working_dir.display()));
    }

    let mut paths = Vec::new();
    for entry in WalkDir::new(working_dir).into_iter().filter_entry(|e| {
        let path = e.path();
        if path == working_dir { return true; }
        let rel_path = path.strip_prefix(working_dir).unwrap();
        if let Some(parent) = rel_path.parent() {
            for component in parent.components() {
                let s = component.as_os_str().to_str().unwrap();
                if s == "tmp" || s == "prm" {
                    return false;
                }
            }
        }
        true
    }) {
        let entry = entry.expect("Failed to read directory entry");
        if entry.path() != working_dir {
            paths.push(entry.path().to_path_buf());
        }
    }
    paths.sort();

    let mut dir_and_file_names = HashSet::new();
    for path in &paths {
        let rel_path = path.strip_prefix(working_dir).unwrap();
        let is_leaf = path.is_file() || !paths.iter().any(|p| p.parent() == Some(path));
        if is_leaf {
            dir_and_file_names.insert(rel_path.to_path_buf());
        }
    }

    let names_allowed = [
        r"\.git(/.*)?",
        r"\.github/workflows/workflow\.yml",
        r"\.gitignore",
        r"CITATION\.bib",
        r"LICENSE",
        r"README",
        r"checks/[^/]+/default\.nix",
        r"flake\.lock",
        r"flake\.nix",
        r"formatter\.nix",
        r"prm(/.*)?",
        r"result",
        r"secrets(/.*)?",
    ];

    let file_dependencies = [
        (r"hosts/[^/]+/configuration\.nix", vec![
            r"hosts/[^/]+/\.terraform(/.*)?",
            r"hosts/[^/]+/\.terraform\.lock\.hcl",
            r"hosts/[^/]+/deploy-requirements\.sh",
            r"hosts/[^/]+/deploy\.sh",
            r"hosts/[^/]+/hardware-configuration\.nix",
            r"hosts/[^/]+/main\.tf",
            r"hosts/[^/]+/prm(/.*)?",
            r"hosts/[^/]+/tmp(/.*)?",
        ]),
        (r"packages/[^/]+/default\.nix", vec![
            r"packages/[^/]+/prm(/.*)?",
            r"packages/[^/]+/result",
            r"packages/[^/]+/tmp(/.*)?",
        ]),
        (r"packages/[^/]+/Cargo\.toml", vec![
            r"packages/[^/]+/Cargo\.lock",
            r"packages/[^/]+/default\.nix",
            r"packages/[^/]+/result",
            r"packages/[^/]+/src(/.*)?",
        ]),
        (r"packages/[^/]+/package\.json", vec![
            r"packages/[^/]+/app(/.*)?",
            r"packages/[^/]+/default\.nix",
            r"packages/[^/]+/next\.config\.mjs",
            r"packages/[^/]+/package-lock\.json",
            r"packages/[^/]+/postcss\.config\.mjs",
            r"packages/[^/]+/tailwind\.config\.ts",
            r"packages/[^/]+/tsconfig\.json",
        ]),
        (r"packages/[^/]+/index\.html", vec![
            r"CNAME",
            r"packages/[^/]+/default\.nix",
            r"packages/[^/]+/script\.js",
            r"packages/[^/]+/style\.css",
        ]),
        (r"packages/[^/]+/main\.c", vec![
            r"packages/[^/]+/default\.nix",
        ]),
        (r"packages/[^/]+/ms\.tex", vec![
            r"packages/[^/]+/default\.nix",
            r"packages/[^/]+/ms\.bib",
        ]),
        (r"packages/[^/]+/Main\.hs", vec![
            r"packages/[^/]+/default\.nix",
            r"packages/[^/]+/main\.cabal",
        ]),
        (r"packages/[^/]+/main\.py", vec![
            r"packages/[^/]+/default\.nix",
            r"packages/[^/]+/static(/.*)?",
            r"packages/[^/]+/templates(/.*)?",
        ]),
        (r"packages/[^/]+/main\.sh", vec![
            r"packages/[^/]+/default\.nix",
        ]),
    ];

    let compiled_names_allowed: Vec<Regex> = names_allowed.iter().map(|p| Regex::new(&format!("^{}$", p)).unwrap()).collect();
    let compiled_file_dependencies: Vec<(Regex, Vec<Regex>)> = file_dependencies.iter()
        .map(|(trigger, patterns)| {
            (
                Regex::new(&format!("^{}$", trigger)).unwrap(),
                patterns.iter().map(|p| Regex::new(&format!("^{}$", p)).unwrap()).collect()
            )
        }).collect();

    let mut allowed_patterns = compiled_names_allowed;
    for path in &dir_and_file_names {
        let path_str = path.to_str().unwrap();
        for (trigger_re, deps) in &compiled_file_dependencies {
            if trigger_re.is_match(path_str) {
                allowed_patterns.extend(deps.clone());
                allowed_patterns.push(trigger_re.clone());
            }
        }
    }

    let mut final_warnings = warnings;
    let mut sorted_names: Vec<_> = dir_and_file_names.into_iter().collect();
    sorted_names.sort();

    for name in sorted_names {
        let name_str = name.to_str().unwrap();
        if !allowed_patterns.iter().any(|re| re.is_match(name_str)) {
            if fix {
                let full_path = working_dir.join(&name);
                if full_path.is_file() {
                    std::fs::remove_file(&full_path).unwrap();
                } else if full_path.is_dir() {
                    std::fs::remove_dir_all(&full_path).unwrap();
                }
                println!("{}/{}: removed", working_dir.display(), name.display());
            } else {
                final_warnings.push(format!("{}/{}: is not allowed", working_dir.display(), name.display()));
            }
        }
    }

    if !final_warnings.is_empty() {
        println!("{}", final_warnings.join("\n"));
        std::process::exit(1);
    } else {
        std::process::exit(0);
    }
}

fn run_tests() {
    test_hello_world();
    test_math();
}

fn test_hello_world() {
    assert_eq!(2 + 2, 4);
    println!("test hello_world ... ok");
}

fn test_math() {
    assert!(2 * 3 == 6);
    println!("test math ... ok");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hello_world_test() {
        test_hello_world();
    }

    #[test]
    fn test_math_test() {
        test_math();
    }
}
