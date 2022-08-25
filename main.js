const axios = require("axios");
const fsP = require("fs/promises");
const fs = require("fs");
const { JSDOM } = require("jsdom");

const filename = "circolari.txt";

function writeDataIntoFile(data) {
    try {
        fs.writeFileSync(filename, data);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

async function getDataFromFile() {
    try {
        const data = await fsP.readFile("./" + filename, "utf-8");

        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

async function getDataFromUrl() {
    // fetch the html file
    let page = await axios.get(
        "https://web.spaggiari.eu/sdg/app/default/comunicati.php?sede_codice=FIIT0009&referer=www.itismeucci.net"
    );
    // convert it to text
    page = await page.data;
    const dom = new JSDOM(page);
    // circolari table
    const table =
        dom.window.document.querySelector("#table-documenti").children[0];

    let circolari = [];
    // iterate over circolari
    for (let i = 1; i < table.children.length; i++) {
        circolari.push(table.children[i].children[1].children[0].textContent);
    }
    return circolari;
}

(async () => {
    let isChanged = false;
    const oldData = await getDataFromFile();
    const newData = await getDataFromUrl();

    // compare old and new data
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i] !== newData[i]) {
            for (let j = i; j < oldData.length; j++) {
                if (oldData[i] == newData[j]) {
                    isChanged = true;
                    break;
                }
                console.log(newData[j]);
            }
        }
        if (isChanged) {
            break;
        }
    }

    // if nothing changed, log and rewriet the file
    if (!isChanged) console.log("No changes");
    writeDataIntoFile(JSON.stringify(newData));
})();
