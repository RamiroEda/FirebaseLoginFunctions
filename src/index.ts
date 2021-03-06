import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';
import admin = require('firebase-admin');
import path = require('path');
import os = require('os');
import fs = require('fs');
import Jimp = require('jimp');


const cors = require('cors')({
    origin: true,
});

admin.initializeApp(functions.config().firebase);

export const userInfoInit = functions.auth.user().onCreate(async (user : auth.UserRecord, context: functions.EventContext) => {
    const document = admin.firestore().collection('users');

    return document.doc(user.uid).set({
        name: user.displayName ?? `usuario_${Date.now()}`,
        imageUrl: "default/default_profile_pic.png",
        backgroundImage: "default/default_bg.jpg",
    });
});

export const userInfoDelete = functions.auth.user().onDelete(async (user : auth.UserRecord, context: functions.EventContext) => {
    const document = admin.firestore().collection('users');

    return document.doc(user.uid).delete();
});


export const deleteUser = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        if(req.body.uid){
            await admin.auth().deleteUser(req.body.uid);
            res.send({
                success : true
            });
        }else{
            res.send({
                success : false
            });
        }
    });
});


export const applyFilter = functions.storage.object().onFinalize(async (file) => {
    if(file.name){
        const fileName = path.basename(file.name);
        if(file.name.startsWith('uploads/')){
            const tempFilePath = path.join(os.tmpdir(), fileName);
            const tempProcFilePath = path.join(os.tmpdir(), "proc_"+fileName);
            await admin.storage().bucket().file(file.name).download({destination: tempFilePath});

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