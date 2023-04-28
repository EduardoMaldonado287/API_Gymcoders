const _module = {
    getStorageAccountName: () => {
        const matches = /AccountName=(.*?);/g.exec(process.env.AZURE_STORAGE_CONNECTION_STRING);
        return matches[1];
    }
};

module.exports = _module;
