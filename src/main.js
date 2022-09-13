import IOManager from "./IO.js";
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

    const circolari = [];
    const circolariWithLinks = [];
    // iterate over circolari
    for (let i = 1; i < table.children.length; i++) {
        // prendere il titolo della circolare
        const title = table.children[i].children[1].children[0].textContent;
        // prendere l'id della circolare
        const id =
            table.children[i].children[2].children[0].getAttribute("id_doc");
        circolariWithLinks.push({
            title,
            id: `https://web.spaggiari.eu/sdg/app/default/view_documento.php?a=akVIEW_FROM_ID&id_documento=${id}&sede_codice=FIIT0009`,
        });

        circolari.push(table.children[i].children[1].children[0].textContent);
    }
    return circolariWithLinks;
}

(async () => {
    let isChanged = false;
    const oldData = await IO.readFile();
    const newData = await getDataFromUrl();

    // compare old and new data
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].title !== newData[i].title) {
            for (let j = i; j < oldData.length; j++) {
                if (oldData[i].title == newData[j].title) {
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

    // // if nothing changed, log and rewrite the file
    if (!isChanged) console.log("No changes");
    await IO.writeFile(JSON.stringify(newData));
})();
