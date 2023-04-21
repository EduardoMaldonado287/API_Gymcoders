const mongoose = require("mongoose");
const { Schema } = mongoose;

const FiltrosModel = new Schema(
  {

    // model3D : {}
    imageName: { type: String, required: true },
    isActive: {type: Boolean, required: true},
    otherFile: { type: String, required: true },
    filterName: {type: String, required: true},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FiltrosModel", FiltrosModel);

    // img: {
    //     data: Buffer,
    //     contentType: String,
    //   },