import express from "express";
import ListingController from "../controllers/listingController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();
const listingController = new ListingController();

// Create a new listing
router.post(
  "/local",
  authenticate,
  listingController.localListing.bind(listingController)
);

// Fetch all active listings
router.get(
  "/getlistings",
  listingController.fetchListings.bind(listingController)
);

// Fetch listings for a specific user
router.get(
  "/getuserlistings",
  authenticate,
  listingController.fetchUserListings.bind(listingController)
);

// Update a listing's status
router.put(
  "/changestatus",
  authenticate,
  listingController.changeStatus.bind(listingController)
);

// Delete a listing
router.delete(
  "/deletelisting",
  authenticate,
  listingController.deleteListing.bind(listingController)
);

// Filter listings based on criteria
router.post(
  "/filterlisting",
  listingController.filterListing.bind(listingController)
);

// Save or unsave a property
router.post(
  "/togglesaveproperty",
  authenticate,
  listingController.toggleSaveProperty.bind(listingController)
);

// Fetch saved properties
router.get(
  "/getsavedproperties",
  authenticate,
  listingController.fetchSavedPropertiesId.bind(listingController)
);

// Get all saved properties
router.get(
  "/getallsavedproperties",
  authenticate,
  listingController.getAllSavedProperties.bind(listingController)
);

// Get a property by ID
router.post(
  "/getpropertybyid",
  listingController.getPropertyById.bind(listingController)
);

// Update a listing
router.put(
  "/updatelisting",
  authenticate,
  listingController.updateListing.bind(listingController)
);

export default router;
