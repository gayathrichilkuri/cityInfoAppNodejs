const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
let responseData;
let DB_NAME = "cityInfo";
let COLLECTION_NAME = "cityInfoApp"
async function main() {
    const uri = `mongodb+srv://gayathri:gayathri@cluster0.mmzy9dh.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
    } finally {
        await client.close();
    }
}


main().catch(console.error);

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });    
        const uri = `mongodb+srv://gayathri:gayathri@cluster0.mmzy9dh.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            responseData = await getCityInfoDataFromDB(client)
            res.end(JSON.stringify(responseData))
        } finally {
            await client.close();
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

async function getCityInfoDataFromDB(client) {
    const cursor = client.db(DB_NAME).collection(COLLECTION_NAME)
        .find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        return results;
    } else {
    }
}
const PORT = process.env.PORT || 5590;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));
