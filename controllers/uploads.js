const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");

const { updateImage } = require("../helpers/update-image");

const uploadImage = async (req, res = response) => {
  const { collection, id } = req.query;

  try {
    // Validar nombre de la coleccion
    const collectiosAllowed = ["users", "hospitals", "doctors"];
    if (!collectiosAllowed?.includes(collection)) {
      return res.status(400).json({
        ok: false,
        msg: "La coleccion debe ser: users, hospitals o doctors",
      });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No se envio ningun archivo en el request.",
      });
    }

    // Validar extension
    const file = req.files?.file;
    const splittedFileName = file.name.split(".");
    const fileExtension = splittedFileName?.[splittedFileName.length - 1] || "";
    const validExtensions = ["jpg", "png", "gif"];
    if (!validExtensions.includes(fileExtension)) {
      return res.status(400).json({
        ok: false,
        msg: "La extension del archivo es invalida.",
      });
    }

    // Generar el nombre y la ruta de guardado
    const fileName = `${uuidv4()}.${fileExtension}`;
    const uploadPath = `./uploads/${collection}/${fileName}`;

    // Mover el archivo a la ruta estipulada
    file.mv(uploadPath, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          ok: false,
          msg: "Error al mover el archivo al directorio indicado.",
        });
      }

      // Actualizar BDD
      const imageUpdated = await updateImage(collection, id, fileName);

      // Archivo subido con exito
      return res.status(200).json({
        ok: true,
        msg: imageUpdated ? "Archivo actualizado!" : "Archivo subido!",
        fileName,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al intentar subir el archivo.",
    });
  }
};

const getImage = (req, res = response) => {
  try {
    const { collection, image } = req.query;

    // Validar nombre de la coleccion
    const collectiosAllowed = ["users", "hospitals", "doctors"];
    if (!collectiosAllowed?.includes(collection)) {
      return res.status(400).json({
        ok: false,
        msg: "La coleccion debe ser: users, hospitals o doctors",
      });
    }

    const imgPath = path.join(__dirname, `../uploads/${collection}/${image}`);

    // Verificar que la ruta exista
    if (fs.existsSync(imgPath)) {
      res.sendFile(imgPath);
    } else {
      const noImagePath = path.join(
        __dirname,
        `../uploads/no_image_placeholder.jpg`
      );
      res.sendFile(noImagePath);
    }

    console.log("##### COLLECTION NAME:", collection);
    console.log("##### IMAGE:", image);
    console.log("##### IMAGE PATH:", imgPath);
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado al intentar obtener una imagen.",
    });
  }
};

module.exports = { uploadImage, getImage };
