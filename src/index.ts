import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';
import admin = require('firebase-admin');
import path = require('path');
import os = require('os');
import fs = require('fs');
import Jimp = require('jimp');

admin.initializeApp(functions.config().firebase);

export const userInfoInit = functions.auth.user().onCreate(async (user : auth.UserRecord, context: functions.EventContext) => {
    const document = admin.firestore().collection('users');

    return document.doc(user.uid).set({
        name: user.displayName ?? 'Usuario',
        imageUrl: "gs://pruebas-354cc.appspot.com/default/default_profile_pic.png",
        backgroundImage: "gs://pruebas-354cc.appspot.com/default/default_bg.jpg",
    });
});

export const userInfoDelete = functions.auth.user().onDelete(async (user : auth.UserRecord, context: functions.EventContext) => {
    const document = admin.firestore().collection('users');

    return document.doc(user.uid).delete();
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