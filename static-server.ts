import http from 'http';
import { ALLOWED_HEADERS, mimeType } from './constants';
import url from 'url';
import StaticFileServerPlugin from 'main';
import { TFile } from 'obsidian';

function toBuffer(ab: ArrayBuffer): Buffer {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

const exp = (folder: string, port: string, plugin: StaticFileServerPlugin) => {
    const fileBufferCache = new Map<string, { ctime: number; buf: Buffer }>();
    const app = plugin.app;
    console.log('Creating server', folder, port);
    const server = http.createServer(async function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        console.log(`${req.method} ${req.url}`);

        try {
            // parse URL
            const parsedUrl = url.parse(req.url);

            const fullPath = folder + parsedUrl.pathname;
            const abstractPath = app.vault.getAbstractFileByPath(fullPath) as TFile;

            let fileBuffer = null;
            if (fileBufferCache.has(fullPath) && fileBufferCache.get(fullPath).ctime == abstractPath.stat.ctime) {
                fileBuffer = fileBufferCache.get(fullPath).buf;
            } else {
                const file = await app.vault.readBinary(abstractPath);

                if (!file) {
                    // if the file is not found, return 404
                    res.statusCode = 404;
                    res.end(`File ${fullPath} not found!`);
                    return;
                }
                fileBuffer = toBuffer(file);
                fileBufferCache.set(fullPath, { ctime: abstractPath.stat.ctime, buf: fileBuffer });
            }

            const ext = '.' + abstractPath.extension;
            // if the file is found, set Content-type and send data
            res.setHeader('Content-type', mimeType[ext as keyof typeof mimeType] || 'text/plain');
            res.end(fileBuffer);
        } catch (e) {
            console.log('error', e);
            res.statusCode = 500;
            res.end(`Error getting the file: ${e}.`);
        }
    });

    return {
        listen() {
            server.listen(port);
        },
        close() {
            server.close();
        }
    };
};

export default exp;
export type StaticServer = ReturnType<typeof exp>;
