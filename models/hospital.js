const { Schema, model, Types } = require("mongoose");

const HospitalSchema = new Schema(
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
  },
  { collection: "Hospitals" }
);

HospitalSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Hospital", HospitalSchema);
