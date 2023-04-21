const { Router } = require("express");
const router = Router();
const upload = require("../multer.js")

const { getFiltros, createFiltro } = require("../controllers/filtros.js");
// prettier-ignore

const cpUpload = upload.fields([{ name: 'imageName', maxCount: 1 }, { name: 'otherFile', maxCount: 1 }])

// app.post('/cool-profile', cpUpload, function (req, res, next) {

router.route("/")
    .get(getFiltros)
    .post(cpUpload, createFiltro);
    // .put(upload.);

module.exports = router;

