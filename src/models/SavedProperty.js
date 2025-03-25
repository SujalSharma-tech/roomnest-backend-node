import mongoose from "mongoose";
const savedPropertySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true }
);

const SavedProperty = mongoose.model("SavedProperty", savedPropertySchema);

export default SavedProperty;
