const FiltrosModel = require("../models/Filtros");
const fs = require("fs");

module.exports = {
  getFiltros: async (req,res)=>{
    try {
      const allData = await FiltrosModel.find()
      res.json(allData)
    } catch (err) {
      return res.json({ message: `Erro al obtener los Filtros. Err: ${err}` });
    }
  },

  createFiltro: (req, res) => {
    const saveFiltro =  FiltrosModel({ //saveImage
      imageName: req.files['imageName'][0].originalname,
      otherFile: req.files['otherFile'][0].originalname,
      filterName: req.body.filterName,
      isActive: req.body.isActive,
    });
    saveFiltro
      .save()
      .then((res) => {
        console.log("All files saved");
      })
      .catch((err) => {
        console.log(err, "error has occur");
      });
      res.send('All files saved')
  },
};

