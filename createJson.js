const axios = require('axios');
const fs = require('fs');
const shell = require('shelljs');
const glob = require('glob');
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);

const quarksDirectoryUrl = 'https://raw.githubusercontent.com/supercollider-quarks/quarks/master/directory.txt';

const sclang = process.env.SCLANG_PATH || "sclang";

const quarksToSkip = [
    "ZZZ", // has a scd file as quark file
]


shell.config.silent = true;

async function extractQuarkInfo(quarkName, quarkFile) {
    j = {}
    if (quarksToSkip.includes(quarkName)) {
        console.log(`Skip Quark ${quarkName}`);
        return j;
    }
    await execFile(`QUARK_FILE=${quarkFile} ${sclang} -i foo quarkToJson.scd`, [], {
        // "env": procEnv,
        "shell": true,
        "timeout": 20 * 1000,
    }).catch((err) => {
        console.log(`Error on extracting Quark info from ${quarkFile}: ${err}`);
        return j;
    });
    const data = fs.readFileSync(`${quarkFile}.json`, 'utf-8');
    try {
        var j = JSON.parse(data);
    } catch (e) {
        console.log(`Could not parse JSON of ${quarkFile}`);
    }
    return j;
}

async function getQuark(quarkName, quarkRepo) {
    var quarkDir = `repos/${quarkName}`;
    var quarkInfo = {
        "quarkName": quarkName,
        "quarkRepo": quarkRepo,
    };

    var process = shell.exec(`cd repos && git clone --depth 1 ${quarkRepo} ${quarkName}`);
    if (process.code != 0) {
        // console.log(`Repo ${quarkName} already available? Try pull`);
        var pullProcess = shell.exec(`cd repos/${quarkName} && git pull`);
        if (pullProcess.code != 0) {
            console.log(`Could not retrieve info from repo ${quarkName}`);
            return quarkInfo;
        }
    }

    // get latest commit date
    var dateProc = shell.exec(`cd repos/${quarkName} && echo $(git log -1 --format="%at")`);
    quarkInfo["lastGitCommitDate"] = parseInt(dateProc.stdout);

    var quarkFiles = glob.sync(quarkDir + '/*.quark');
    if (quarkFiles.length == 0) {
        console.log(`Did not found a quark file for ${quarkName} in ${quarkDir}`);
        return quarkInfo;
    }
    var quarkFile = quarkFiles[0];
    console.log(`Found quark file ${quarkFile}`);
    var extractedQuarkInfo = await extractQuarkInfo(quarkName, quarkFile, quarkRepo);
    return {
        ...extractedQuarkInfo,
        ...quarkInfo
    };
}

async function getQuarksList() {
    let resp = await axios.get(quarksDirectoryUrl);
    // skip last entry as this is an empty line
    return await Promise.all(resp.data.split(/\r?\n/).slice(0, -1).map(async (l) => {
        var quarkName = l.split("=")[0].trim();
        // remove also any kind of tags
        var quarkRepo = l.split("=")[1].trim().split("@")[0];
        var r = await getQuark(quarkName, quarkRepo);
        return r;
    }, 4));
}


async function main() {
    const result = await getQuarksList();
    // const result = await getQuark("Maths", "https://github.com/spluta/Maths");
    // const result = await extractQuarkInfo("maths", "repos/Maths/Maths.quark");
    // console.log(result);
    fs.writeFileSync("src/assets/quarks.json", JSON.stringify(result, null, 2));
}

main();