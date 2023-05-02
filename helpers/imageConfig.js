require('dotenv').config();

const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const config = require('./AzureStorageConfig');
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(); // .env variable
const containerName = 'imagenes';
const getStream = require('into-stream');

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
  };

function addImage(blobName, stream, streamLength)
{
  blobService.createBlockBlobFromStream(containerName, blobName, getStream(stream), streamLength, err => {
    if (err){
      console.log(err);
      return false;
    } else {
        console.log("Imagen subida exitosamente");
        return true;
    }
  })
  return true;
}

module.exports = {
    multer,
    inMemoryStorage,
    uploadStrategy,
    config,
    azureStorage,
    blobService,
    containerName,
    getStream,
    getBlobName,
    addImage,
};