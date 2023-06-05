require('dotenv').config(); // Carga las variables de entorno del archivo .env

const multer = require('multer'); // Importa el módulo multer para el manejo de archivos
const inMemoryStorage = multer.memoryStorage(); // Configura un almacenamiento en memoria para los archivos subidos
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image'); // Configura una estrategia de carga de archivos usando multer
const config = require('./AzureStorageConfig'); // Importa la configuración de Azure Storage
const azureStorage = require('azure-storage'); // Importa el módulo azure-storage para interactuar con Azure Blob Storage
const blobService = azureStorage.createBlobService(); // Crea una instancia del servicio Blob de Azure Storage
const containerName = 'imagenes'; // Nombre del contenedor en Azure Blob Storage
const getStream = require('into-stream'); // Importa el módulo into-stream para convertir un stream en un Buffer

// Función que genera un nombre único para el blob a partir del nombre original del archivo
const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

// Función que agrega una imagen al contenedor de Blob Storage
function addImage(blobName, stream, streamLength) {
    blobService.createBlockBlobFromStream(containerName, blobName, getStream(stream), streamLength, err => {
        if (err) {
            console.log(err);
            return false;
        } else {
            console.log("Imagen subida exitosamente");
            return true;
        }
    });
    return true; // Esto no se ejecutará, ya que el retorno anterior ya habrá finalizado la función
}

// Función que elimina una imagen del contenedor de Blob Storage
function deleteImage(blobName) {
    blobService.deleteBlobIfExists(containerName, blobName, (err, result) => {
        if (err) {
            console.log(err);
            return false;
        } else if (result) {
            console.log("Imagen eliminada exitosamente");
            return true;
        } else {
            console.log("La imagen no existe en Azure Storage");
            return false;
        }
    });
}

module.exports = {
    multer,
    inMemoryStorage,
    uploadStrategy,
    config,
    azureStorage,
    blobService,
    containerName,
    deleteImage,
    getStream,
    getBlobName,
    addImage,
};
