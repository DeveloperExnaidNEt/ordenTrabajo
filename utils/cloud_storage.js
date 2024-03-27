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
 * Función para cargar una imagen a Firebase Storage
 * @param {Object} fileInfo Información del archivo adjunto
 * @param {string} pathImage Ruta donde se guardará la imagen en Firebase Storage
 * @param {string} deletePathImage Ruta de la imagen a eliminar (si existe)
 * @returns {Promise<string>} Promise que resuelve con la URL de la imagen cargada
 */
async function uploadImageToFirebase(fileInfo, pathImage, deletePathImage) {
    return new Promise((resolve, reject) => {
        // Verificar si hay una ruta de eliminación especificada y eliminar la imagen anterior (si existe)
        if (deletePathImage) {
            try {
                const parseDeletePathImage = url.parse(deletePathImage);
                const ulrDelete = parseDeletePathImage.pathname.slice(23);
                const fileDelete = bucket.file(ulrDelete);

                fileDelete.delete().then(() => {
                    console.log('Se borró la imagen anterior con éxito');
                }).catch(err => {
                    console.log('Error al eliminar la imagen anterior:', err);
                });
            } catch (error) {
                console.log('Error al procesar la eliminación de la imagen anterior:', error);
            }
        }

        // Verificar si se proporcionó la información del archivo
        if (!fileInfo || !fileInfo.buffer) {
            reject('No se proporcionó un archivo válido.');
            return;
        }

        // Crear una referencia al archivo en Firebase Storage
        const fileUpload = bucket.file(pathImage);
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

        // Resolver con la URL de la imagen una vez que se haya cargado
        blobStream.on('finish', () => {
            const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`);
            console.log('URL DE CLOUD STORAGE:', url);
            resolve(url);
        });

        // Escribir el contenido del archivo en el stream
        blobStream.end(fileInfo.buffer);
    });
}

module.exports = uploadImageToFirebase;
