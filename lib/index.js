"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const os = require("os");
const fs = require("fs");
const Jimp = require("jimp");
const cors = require('cors')({
    origin: true,
});
admin.initializeApp(functions.config().firebase);
exports.userInfoInit = functions.auth.user().onCreate(async (user, context) => {
    var _a;
    const document = admin.firestore().collection('users');
    return document.doc(user.uid).set({
        name: (_a = user.displayName, (_a !== null && _a !== void 0 ? _a : `usuario_${Date.now()}`)),
        imageUrl: "default/default_profile_pic.png",
        backgroundImage: "default/default_bg.jpg",
    });
});
exports.userInfoDelete = functions.auth.user().onDelete(async (user, context) => {
    const document = admin.firestore().collection('users');
    return document.doc(user.uid).delete();
});
exports.deleteUser = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        if (req.body.uid) {
            await admin.auth().deleteUser(req.body.uid);
            res.send({
                success: true
            });
        }
        else {
            res.send({
                success: false
            });
        }
    });
});
exports.applyFilter = functions.storage.object().onFinalize(async (file) => {
    if (file.name) {
        const fileName = path.basename(file.name);
        if (file.name.startsWith('uploads/')) {
            const tempFilePath = path.join(os.tmpdir(), fileName);
            const tempProcFilePath = path.join(os.tmpdir(), "proc_" + fileName);
            await admin.storage().bucket().file(file.name).download({ destination: tempFilePath });
            const image = await Jimp.read(tempFilePath);
            image.grayscale().write(tempProcFilePath);
            await admin.storage().bucket().upload(tempProcFilePath, {
                destination: `gen/${fileName}`,
            });
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(tempProcFilePath);
        }
    }
});
//# sourceMappingURL=index.js.map