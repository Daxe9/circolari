import * as fsP from "fs/promises";
import * as fs from "fs";
export default class IOManager {
    constructor(filename) {
        this._filename = filename;
    }

    async writeFile(data) {
        try {
            await fsP.writeFile(this._filename, data);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }

    async readFile() {
        try {
            if (fs.existsSync(this._filename)) {
                const data = await fsP.readFile(this._filename, "utf-8");
                return JSON.parse(data);
            } else {
                await fsP.writeFile(this._filename, "[]");
            }
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
}
