
 
  
/* 

YT : CRUT L2F
PROJECT : LUTBOTZ


 No Jual Script ini ya cil
 Ketahuan? Saya Matikan akses script Nya!!!



please appreciate the developer of this script, please do not remove developer credits!


*/

























































































































































































































































































const fs = require("fs");
const toMs = require("ms");
const path = require('path');

const premiumFile = path.resolve(__dirname, 'database', 'premium.json');
let premium;
try {
    premium = JSON.parse(fs.readFileSync(premiumFile));
    if (!Array.isArray(premium)) premium = [];
} catch (e) {
    premium = [];
}

const addPremiumUser = (userId, expired, _dir) => {
    if (!Array.isArray(_dir)) throw new TypeError("_dir harus berupa array");
    const userIndex = _dir.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        _dir[userIndex].expired += toMs(expired);
    } else {
        const newUser = { id: userId, expired: Date.now() + toMs(expired) };
        _dir.push(newUser);
    }
    fs.writeFileSync(premiumFile, JSON.stringify(_dir, null, 2));
};

const getPremiumPosition = (userId, _dir) => _dir.findIndex((user) => user.id === userId);

const getPremiumExpired = (userId, _dir) => {
    const user = _dir.find((user) => user.id === userId);
    return user ? user.expired : null;
};

const checkPremiumUser = (userId, _dir) => _dir.some((user) => user.id === userId);

const expiredPremiumCheck = (LutBotz, msg, _dir) => {
    setInterval(() => {
        _dir = _dir.filter((user) => {
            if (Date.now() >= user.expired) {
                console.log(`Premium expired: ${user.id}`);
                fs.writeFileSync(premiumFile, JSON.stringify(_dir, null, 2));
                if (user.id) LutBotz.sendMessage(user.id, { text: "Your premium has run out, please buy again." });
                return false;
            }
            return true;
        });
    }, 1000);
};

const getAllPremiumUser = (_dir) => _dir.map((user) => user.id);

module.exports = {
    addPremiumUser,
    getPremiumExpired,
    getPremiumPosition,
    expiredPremiumCheck,
    checkPremiumUser,
    getAllPremiumUser,
};