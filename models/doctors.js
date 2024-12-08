const { Schema, model, Types } = require("mongoose");

const DoctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    user: {
      required: true,
      type: Types.ObjectId,
      ref: "User",
    },
    hospital: {
      required: true,
      type: Types.ObjectId,
      ref: "Hospital",
    },
  },
  { collection: "Doctors" }
);

DoctorSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Doctor", DoctorSchema);
