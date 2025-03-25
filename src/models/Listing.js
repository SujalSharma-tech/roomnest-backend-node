import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    no_of_rooms: {
      type: Number,
      required: true,
    },
    no_of_bathrooms: {
      type: Number,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
    wifi: {
      type: Boolean,
      default: false,
    },
    pets_allowed: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    utilities_included: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    additional_photos: {
      type: [String],
      default: [],
    },
    maps_included: {
      type: Boolean,
      default: false,
    },
    laundry: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
