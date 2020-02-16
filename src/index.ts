import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';
import admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

export const userInfoInit = functions.auth.user().onCreate(async (user : auth.UserRecord, context: functions.EventContext) => {
    const document = admin.database().ref();

    return document.child("users").child(user.uid).set({
        imageUrl: admin.storage().bucket('default/default/image/'),
        name: user.displayName,
        backgroundImage: "https://images5.alphacoders.com/104/1044400.jpg",

    });
});

export const userInfoDelete = functions.auth.user().onDelete(async (user : auth.UserRecord, context: functions.EventContext) => {
    const document = admin.database().ref();

    return document.child("users").child(user.uid).remove();
});