import IOManager from "./IO";
import axios from "axios";
import { JSDOM } from "jsdom";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
dotenv.config({ path: resolve(dirname("../"), "./.env") });

const filename = process.env.FILENAME;
const URL = process.env.URL;
const IO = new IOManager(filename);

async function getDataFromUrl() {
    // fetch the html file
    let page = await axios.get(URL);
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
    const oldData = await IO.readFile();
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

    // if nothing changed, log and rewrite the file
    if (!isChanged) console.log("No changes");
    await IO.writeFile(JSON.stringify(newData));
})();
