process.title = "Node.js Bing Wallpaper Service Host"
const http = require('http');
const https = require('https');
const url = require("url");
http.createServer((req, response) => {
	let path = url.parse(req.url).pathname
	if (path === "/shutdown") {
		process.exit()
	}
	if (path === "/favicon.ico") {
		response.writeHead(403,{'Content-Type': 'text/plain'})
		response.end("{'err':'403','msg':'forbidden','notice':'no icon'}")
	} else {
    response.writeHead(200, {
        'Content-Type': 'image/jpeg'
    });
    https.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', (bing_res) => {
        let bing_body = [], bing_data = {};
        bing_res.on('data', (chunk) => {
            bing_body.push(chunk);
        });
        bing_res.on('end', () => {
            bing_body = Buffer.concat(bing_body);
            bing_data = JSON.parse(bing_body.toString());
            https.get(`https://www.bing.com${bing_data.images[0].url}`, (img_res) => {
                let img_body = [];
                img_res.on('data', (chunk) => {
                    img_body.push(chunk);
                });
                img_res.on('end', () => {
                    img_body = Buffer.concat(img_body);
                    response.write(img_body, 'binary');
                    response.end();
                });
            });
        });
    });}
}).listen(60182);

console.log("use [http://127.0.0.1:60182/index.jpg] to download image.");
console.log("use [http://127.0.0.1:60182/shutdown] to close server.");