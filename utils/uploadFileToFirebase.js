const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const url = require('url');
const { v4: uuidv4 } = require('uuid');

// Crear una instancia de Storage con las credenciales y la configuración necesarias
const storage = new Storage({
    projectId: "catering-c8372",
    keyFilename: './serviceAccountKey.json'
});

// Obtener el bucket de Firebase Storage
const bucket = storage.bucket("catering-c8372.appspot.com");

/**
 * Función para cargar un archivo a Firebase Storage
 * @param {Object} fileInfo Información del archivo adjunto
 * @param {string} pathImage Ruta donde se guardará el archivo en Firebase Storage
 * @param {string} deletePathImage Ruta del archivo a eliminar (si existe)
 * @returns {Promise<string>} Promise que resuelve con la URL del archivo cargado
 */
async function uploadFileToFirebase(fileInfo, pathFile, deletePathFile) {
    return new Promise((resolve, reject) => {
        // Verificar si hay una ruta de eliminación especificada
        if (deletePathFile) {
            const parseDeletePathFile = url.parse(deletePathFile);
            const ulrDelete = parseDeletePathFile.pathname.slice(23);
            const fileDelete = bucket.file(ulrDelete);

            // Eliminar el archivo anterior (si existe)
            fileDelete.delete().then((fileDelete) => {
                console.log('Se borró el archivo anterior con éxito');
            }).catch(err => {
                console.log('Error al eliminar el archivo anterior:', err);
            });
        }

        // Verificar si se proporcionó la información del archivo
        if (!fileInfo || !fileInfo.buffer) {
            reject('No se proporcionó un archivo válido.');
            return;
        }

        // Crear una referencia al archivo en Firebase Storage
        const fileUpload = bucket.file(pathFile);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: fileInfo.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: uuidv4(),
                }
            },
            resumable: false
        });

        // Manejar errores durante la carga del archivo
        blobStream.on('error', (error) => {
            console.log('Error al subir archivo a Firebase:', error);
            reject('Ocurrió un error al subir el archivo.');
        });

        // Resolver con la URL del archivo una vez que se haya cargado
        blobStream.on('finish', () => {
            const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`);
            console.log('URL DE CLOUD STORAGE:', url);
            resolve(url);
        });

        // Escribir el contenido del archivo en el stream
        blobStream.end(fileInfo.buffer);
    });
}

module.exports = uploadFileToFirebase;
