"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const os = require("os");
const fs = require("fs");
const Jimp = require("jimp");
admin.initializeApp(functions.config().firebase);
exports.userInfoInit = functions.auth.user().onCreate(async (user, context) => {
    var _a;
    const document = admin.firestore().collection('users');
    return document.doc(user.uid).set({
        name: (_a = user.displayName, (_a !== null && _a !== void 0 ? _a : 'Usuario')),
        imageUrl: "gs://pruebas-354cc.appspot.com/default/default_profile_pic.png",
        backgroundImage: "gs://pruebas-354cc.appspot.com/default/default_bg.jpg",
    });
});
exports.userInfoDelete = functions.auth.user().onDelete(async (user, context) => {
    const document = admin.firestore().collection('users');
    return document.doc(user.uid).delete();
});
exports.applyFilter = functions.storage.object().onFinalize(async (file) => {
    var _a;
    const filePath = file.name;
    if (filePath) {
        const fileName = path.basename(filePath);
        if ((_a = file.name) === null || _a === void 0 ? void 0 : _a.startsWith('uploads/')) {
            const bucket = admin.storage().bucket();
            const tempFilePath = path.join(os.tmpdir(), fileName);
            const tempProcFilePath = path.join(os.tmpdir(), "proc_" + fileName);
            await bucket.file(filePath).download({ destination: tempFilePath });
            const image = await Jimp.read(tempFilePath);
            image.grayscale().write(tempProcFilePath);
            await bucket.upload(tempProcFilePath, {
                destination: `gen/${fileName}`,
            });
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(tempProcFilePath);
        }
    }
});
//# sourceMappingURL=index.js.map