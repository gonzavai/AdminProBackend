const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctors");
const fs = require("fs");

const deleteImage = (pathToDelete) => {
  try {
    if (fs.existsSync(pathToDelete)) {
      console.log(`##### EXISTE el OLDPATH: ${pathToDelete}`);
      // borrar imagen vieja
      fs.unlinkSync(pathToDelete);
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const updateImage = async (collection, id, newFileName) => {
  try {
    let oldPath = "";
    switch (collection) {
      case "users":
        // Verificar existencia del usuario
        const userDB = await User.findById(id);
        console.log("#### EXISTE USUARIO:", userDB);
        if (!userDB) {
          return false;
        }
        // Verificar existencia previa
        oldPath = `./uploads/${collection}/${userDB?.img}`;
        console.log("##### OLDPATH:", oldPath);
        deleteImage(oldPath);
        // Actualizar eb DB
        userDB.img = newFileName;
        const savedUser = await userDB.save();
        if (!savedUser) {
          return false;
        }
        break;

      case "hospitals":
        // Verificar existencia del hospital
        const hospitalDB = await Hospital.findById(id);
        console.log("#### EXISTE HOSPITAL:", hospitalDB);
        if (!hospitalDB) {
          return false;
        }
        // Verificar existencia previa
        oldPath = `./uploads/${collection}/${hospitalDB?.img}`;
        console.log("##### OLDPATH:", oldPath);
        const deletedImage = deleteImage(oldPath);
        console.log("##### DELETED IMAGE?", deletedImage);
        // Actualizar eb DB
        hospitalDB.img = newFileName;
        const savedHospital = await hospitalDB.save();
        console.log("##### SAVED HOSPITAL:", savedHospital);
        if (!savedHospital) {
          return false;
        }
        break;

      case "doctors":
        // Verificar existencia del doctor
        const doctorDB = await Doctor.findById(id);
        console.log("#### EXISTE DOCTOR:", doctorDB);
        if (!doctorDB) {
          return false;
        }
        // Verificar existencia previa
        oldPath = `./uploads/${collection}/${doctorDB?.img}`;
        console.log("##### OLDPATH:", oldPath);
        deleteImage(oldPath);
        // Actualizar eb DB
        doctorDB.img = newFileName;
        const savedDoctor = await doctorDB.save();
        console.log("##### SAVED DOCTOR:", savedDoctor);
        if (!savedDoctor) {
          return false;
        }
        break;
    }
    //Imagen actualizada en BDD
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  updateImage,
};
