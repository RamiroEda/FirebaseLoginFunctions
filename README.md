# FirebaseLoginFunctions

## [DEMO](https://pruebas-354cc.firebaseapp.com/login)

## Servidor de desarrollo

Correr `npm run serve` para correr un servidor de desarrollo. Para acceder abrir `http://localhost:5000/` en el navegador.

## Subir a Firebase

Correr `npm run deploy` para desplegar el proyecto en Firebase.

## Funciones

### userInfoInit

|          | Descripción             |
|----------|-------------------------|
| Servicio | Firebase Authentication |
| Tipo     | Trigger                 |
| Función  | User.onCreate           |

Esta función se ejecuta cada que un usuario crea una cuenta en la aplicación. Con esta función se escribe en la base de datos de Firestore datos iniciales del usuario en la colección **users**.

### userInfoDelete

|          | Descripción             |
|----------|-------------------------|
| Servicio | Firebase Authentication |
| Tipo     | Trigger                 |
| Función  | User.onDelete           |

Esta función se ejecuta cada que un usuario elimina su cuenta en la aplicación. Cuando se ejecuta elimina los datos del usuario en la colección **users**.


### deleteUser

|            | Descripción                                                     |
|------------|-----------------------------------------------------------------|
| Servicio   | Firebase Functions                                              |
| Tipo       | HTTP Request                                                    |
| Función    | HTTPS.onRequest                                                 |
| Método     | POST                                                            |
| Parámetros | uid: String                                                     |
| URL        | https://us-central1-pruebas-354cc.cloudfunctions.net/deleteUser |


Se ejecuta cada que la aplicación hace una petición HTTP a la URL. Borrará el usuario con base en su UID.


### applyFilter

|          | Descripción             |
|----------|-------------------------|
| Servicio | Firebase Storage        |
| Tipo     | Trigger                 |
| Función  | Object.onFinalize       |


Se ejecuta cada que se sube o modifica un archivo en Firebase Storage. Nos permite aplicar el filtro Grayscale a los archivos subidos al directorio `uploads/` y subir los resultados a la carpeta `gen/`.

