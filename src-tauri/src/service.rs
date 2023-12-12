use regex::Regex;
use std::fs;
use tauri::{self};

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror:: Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
pub fn get_file_modified_time(file_path: &str) -> Result<std::time::SystemTime, Error> {
    let metadata = fs::metadata(file_path)?;
    let modified_time = metadata.modified()?;
    Ok(modified_time)
}

#[derive(Debug)]
struct UsizePair(usize, usize);

fn clean_no_use_section(origin_config: &str, config: &str) -> Result<String, Error> {
    let mut ready_to_deleted_vec: Vec<UsizePair> = vec![];
    origin_config.lines().enumerate().for_each(|(i, line)| {
        if !line.contains("[") || !line.contains("]") || line.contains(";") {
            if line.trim().is_empty()
                && ready_to_deleted_vec.len() > 0
                && ready_to_deleted_vec.last_mut().unwrap().1 == 0
            {
                ready_to_deleted_vec.last_mut().unwrap().1 = i;
            }

            if i == origin_config.lines().collect::<Vec<&str>>().len() - 1
                && ready_to_deleted_vec.len() > 0
                && ready_to_deleted_vec.last_mut().unwrap().1 == 0
            {
                ready_to_deleted_vec.last_mut().unwrap().1 = i;
            }

            return;
        }

        let origin_config_vec = origin_config.lines().collect::<Vec<_>>();
        config
            .lines()
            .find(|l| l.trim() == line.split(";").next().unwrap_or_else(|| "").trim())
            .unwrap_or_else(|| {
                let mut idx = i.clone();

                while idx >= 1
                    && !origin_config_vec[idx - 1].is_empty()
                    && origin_config_vec[idx - 1].trim().starts_with(";")
                {
                    idx -= 1;
                }

                ready_to_deleted_vec.push(UsizePair(idx, 0));
                ""
            });
    });

    let result = origin_config
        .lines()
        .enumerate()
        .filter(|(i, _)| {
            ready_to_deleted_vec
                .iter()
                .map(|usize_pair| !(i >= &usize_pair.0 && i <= &usize_pair.1))
                .all(|x| x)
        })
        .map(|(_, line)| line.to_string())
        .collect::<Vec<String>>()
        .join("\n");

    Ok(result)
}

fn generate_key_val_str(key: &str, val: &str) -> String {
    format!(
        "{}{} = {}{}",
        key,
        " ".repeat(24 - (if key.len() > 24 { 24 } else { key.len() })),
        val,
        " ".repeat(29 - (if val.len() > 29 { 29 } else { val.len() }))
    )
}

fn check_is_used_key(config: &str, cur_section_name: &str, line: &str) -> bool {
    // keep comment line
    if line.starts_with(";") {
        return true;
    }

    // key not include in config will return false
    let key = line.split("=").next().unwrap().trim();
    let (idx, _) = config
        .lines()
        .enumerate()
        .find(|(_, line)| line.trim() == cur_section_name)
        .unwrap_or_else(|| (0, ""));

    for (i, l) in config.lines().enumerate() {
        if i > idx && l.is_empty() {
            break;
        }

        if i >= idx {
            if l.split("=").next().unwrap().trim() == key {
                return true;
            }
        }
    }

    false
}

#[tauri::command]
pub fn write_config_to_file(file_path: &str, config: &str) -> Result<String, Error> {
    let mut origin_config = fs::read_to_string(file_path)?;
    let mut cur_section_name = "".to_string();

    // no need section clean
    origin_config = clean_no_use_section(&origin_config, config)?;

    config.lines().for_each(|line| {
        if line.trim().is_empty() {
            return;
        }

        // find section
        if line.trim().starts_with("[") && !line.trim().contains(";") {
            cur_section_name = line.trim().to_string();

            // section not found to add the new section
            if origin_config
                .lines()
                .find(|line| line.trim() == cur_section_name)
                .unwrap_or_else(|| "")
                .is_empty()
            {
                origin_config.push_str(format!("\n\n{line}").as_str());
            }

            return;
        }

        // add/modify/delete key
        if line.contains("=") {
            let mut split_line = line.split("=");
            let key = split_line.next().unwrap().trim();
            let val = split_line.next().unwrap().trim();

            // find cur section index in origin config
            let res: (usize, &str) = match origin_config
                .lines()
                .enumerate()
                .find(|(_, line)| line.split(";").next().unwrap().trim() == cur_section_name)
            {
                Some(res) => res,
                None => (0 as usize, ""),
            };

            let idx = res.0 + 1;
            let origin_config_len = origin_config.lines().collect::<Vec<&str>>().len();
            if !res.1.is_empty() && idx < origin_config_len {
                let mut origin_config_vec: Vec<String> = vec![];
                let pattern = Regex::new(r"=([^;]+)").unwrap();
                let mut stop_flag = false;
                let mut find_key = false;

                origin_config.lines().enumerate().for_each(|(i, line)| {
                    if i < idx || stop_flag {
                        origin_config_vec.push(line.to_string());
                        return;
                    }

                    if line.is_empty() {
                        stop_flag = true;
                        if !find_key {
                            origin_config_vec.push(generate_key_val_str(key, val))
                        }
                        origin_config_vec.push(line.to_string());
                        return;
                    }

                    if line.split("=").next().unwrap().trim() == key {
                        find_key = true;
                        let result = pattern
                            .replace(
                                &line,
                                format!(
                                    "= {}{}",
                                    val,
                                    " ".repeat(29 - (if val.len() > 29 { 29 } else { val.len() }))
                                ),
                            )
                            .into_owned();

                        origin_config_vec.push(result);
                        return;
                    }

                    if i == origin_config_len - 1 {
                        stop_flag = true;
                        if check_is_used_key(config, cur_section_name.as_str(), line) {
                            origin_config_vec.push(line.to_string());
                        }

                        if !find_key {
                            origin_config_vec.push(generate_key_val_str(key, val))
                        }
                        return;
                    }

                    if check_is_used_key(config, cur_section_name.as_str(), line) {
                        origin_config_vec.push(line.to_string());
                    }
                });

                origin_config = origin_config_vec.join("\n");
            } else {
                origin_config.push_str(format!("\n{}", generate_key_val_str(key, val)).as_str());
            }

            return;
        }
    });

    println!("origin config => \n{}", origin_config);

    Ok(origin_config)
}

mod test {

    #[test]
    fn test_write_config_to_file() {
        use super::write_config_to_file;
        const TEST_FILE_PATH: &str = "D:\\MeteorWork\\DefaultEpsonS3200_PccE_dev_back.cfg";

        let config = "\
[Test]
SimFilePath=\"D:\\desktop\\simFile\"
SaveSimFiles=1
LogToDisk=1
LogCommands=1
LogTranslatorEvents=0
LogSetup=1
LogModules=Setup|ConfigEngine|Commands|Waveforms|PccConnection
LogFile=PrintEngine.Log
HeadInfoLog=1
HeadInfoLogPath=\"D:\\desktop\\simFile\"

[Test2.33]
123=456
y89=sdfsdf
3423=sdfsdf

[Parameters]
AutoLoad                 = 1
";

        write_config_to_file(TEST_FILE_PATH, config).unwrap();
    }
}
