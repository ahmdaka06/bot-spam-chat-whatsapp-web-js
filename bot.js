const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const SESSION_FILE_PATH = './session.json';
const axios = require('axios');

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) { //mengecek apakah udah ada session yang tersimpan
    sessionCfg = require(SESSION_FILE_PATH);
}
const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });
client.initialize();
client.on('qr', (qr) => { //menampilkan qr code dan menerima qr code
    console.log('QR RECEIVED', qr);
});
client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {  //jika session belum tersimpan maka akan membuat session baru 
        if (err) {
            console.error(err);
        }
    });
});
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});
client.on('ready', () => {
    console.log('READY');
});
client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
    if(msg.body.toLowerCase().match(/62/i)){
        const explode = await msg.body.toLowerCase().split("|", 3);
        let target = explode[0];
        let jumlah = explode[1];
        let text = explode[2];
        for (let index = 0; index < jumlah; index++) {
            client.sendMessage(`${target}@c.us`, text);       
        }
    }

});
client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
