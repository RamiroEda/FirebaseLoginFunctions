"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.userInfoInit = functions.auth.user().onCreate(async (user, context) => {
    const document = admin.database().ref();
    return document.child("users").child(user.uid).set({
        imageUrl: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
        name: 'Hola mundo'
    });
});
exports.userInfoDelete = functions.auth.user().onDelete(async (user, context) => {
    const document = admin.database().ref();
    return document.child("users").child(user.uid).remove();
});
//# sourceMappingURL=index.js.map