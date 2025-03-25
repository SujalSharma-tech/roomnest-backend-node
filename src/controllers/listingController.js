import Listing from "../models/Listing.js";
import SavedProperty from "../models/SavedProperty.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

class ListingController {
  async createListing(req, res) {
    try {
      const {
        title,
        description,
        no_of_rooms,
        rent,
        address,
        city,
        state,
        postal_code,
        wifi,
        pets_allowed,
      } = req.body;
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const newListing = new Listing({
        title,
        description,
        no_of_rooms,
        rent,
        address,
        city,
        state,
        postal_code,
        wifi,
        pets_allowed,
        user_id: userId,
      });

      await newListing.save();
      res.status(201).json({ message: "Listing Created Successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create listing", error: error.message });
    }
  }

  async localListing(req, res) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Process images
      const imageUrls = [];

      if (req.files && req.files.images) {
        const images = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const image of images) {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "listings/",
          });

          imageUrls.push(result.secure_url);
        }
      }

      // Parse boolean values from form data
      const wifi = req.body.wifi === "true";
      const pets_allowed = req.body.pets_allowed === "true";
      const furnished = req.body.furnished === "true";
      const utilities_included = req.body.utilities_included === "true";
      const parking = req.body.parking === "true";
      const laundry = req.body.laundry === "true";
      const lat = req.body.latitude || 0;
      const lng = req.body.longitude || 0;

      const newListing = new Listing({
        title: req.body.title,
        description: req.body.description,
        no_of_rooms: req.body.bedrooms,
        no_of_bathrooms: req.body.bathrooms,
        rent: req.body.price,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state || "Punjab",
        postal_code: req.body.postal_code || 144401,
        wifi,
        pets_allowed,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        furnished,
        utilities_included,
        parking,
        laundry,
        additional_photos: imageUrls,
        user_id: userId,
        is_active: true,
        phone: req.body.phone,
      });

      await newListing.save();
      res
        .status(201)
        .json({ message: "Listing Created Successfully", success: true });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create listing",
        error: error.message,
        success: false,
      });
    }
  }

  async fetchUserListings(req, res) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const listings = await Listing.find({ user_id: userId });
      res.status(200).json(listings);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch listings", error: error.message });
    }
  }

  async deleteListing(req, res) {
    try {
      const { id } = req.body;
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const result = await Listing.deleteOne({ _id: id, user_id: userId });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Listing Deleted Successfully" });
      } else {
        res
          .status(404)
          .json({ message: "Listing not found or not authorized" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete listing", error: error.message });
    }
  }

  async changeStatus(req, res) {
    try {
      const { id, status } = req.body;
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const result = await Listing.findOneAndUpdate(
        { _id: id, user_id: userId },
        { is_active: status },
        { new: true }
      );

      if (result) {
        res
          .status(200)
          .json({ message: "Listing Status Changed Successfully" });
      } else {
        res
          .status(404)
          .json({ message: "Listing not found or not authorized" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to change status", error: error.message });
    }
  }

  async fetchListings(req, res) {
    try {
      const listings = await Listing.find({ is_active: true });
      res.status(200).json(listings);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch listings", error: error.message });
    }
  }

  async filterListing(req, res) {
    try {
      const { location, propertyType, bedrooms, minPrice, maxPrice } = req.body;

      // Build the query object
      const query = { is_active: true };

      if (location) {
        query.$or = [
          { city: { $regex: location, $options: "i" } },
          { title: { $regex: location, $options: "i" } },
          { address: { $regex: location, $options: "i" } },
          { description: { $regex: location, $options: "i" } },
          { state: { $regex: location, $options: "i" } },
        ];
      }

      if (propertyType && propertyType !== "any") {
        query.property_type = propertyType;
      }

      if (bedrooms) {
        query.no_of_rooms = parseInt(bedrooms);
      }

      if (minPrice || maxPrice) {
        query.rent = {};
        if (minPrice) query.rent.$gte = parseFloat(minPrice);
        if (maxPrice) query.rent.$lte = parseFloat(maxPrice);
      }

      const properties = await Listing.find(query);
      res.status(200).json({ success: true, properties });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async toggleSaveProperty(req, res) {
    try {
      const { property_id } = req.body;
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // Check if property is already saved
      const savedProperty = await SavedProperty.findOne({
        user_id,
        property_id,
      });

      if (savedProperty) {
        // If saved, remove it
        await SavedProperty.deleteOne({ user_id, property_id });
        res.status(200).json({
          success: true,
          saved: false,
          message: "Property removed from favorites",
        });
      } else {
        // If not saved, add it
        const newSavedProperty = new SavedProperty({
          user_id,
          property_id,
        });
        await newSavedProperty.save();
        res.status(200).json({
          success: true,
          saved: true,
          message: "Property added to favorites",
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async fetchSavedPropertiesId(req, res) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const savedProperties = await SavedProperty.find({ user_id }).select(
        "property_id -_id"
      );

      const savedPropertyIds = savedProperties.map((sp) => sp.property_id);

      res.status(200).json({
        success: true,
        saved_properties: savedPropertyIds,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAllSavedProperties(req, res) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const savedProperties = await SavedProperty.find({ user_id }).select(
        "property_id"
      );

      const savedPropertyIds = savedProperties.map((sp) => sp.property_id);

      const listings = await Listing.find({
        _id: { $in: savedPropertyIds },
      });

      res.status(200).json({
        success: true,
        listings,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPropertyById(req, res) {
    try {
      const { property_id } = req.body;

      const listing = await Listing.findById(property_id);

      if (listing) {
        res.status(200).json({ success: true, listing });
      } else {
        res.status(404).json({ success: false, error: "Listing not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Add this method to your ListingController class
  async updateListing(req, res) {
    try {
      const id = req.body.property_id;
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Find the existing listing first
      const existingListing = await Listing.findOne({
        _id: id,
        user_id: userId,
      });
      if (!existingListing) {
        return res.status(404).json({
          success: false,
          message:
            "Listing not found or you don't have permission to update it",
        });
      }

      // Get existing photos
      let currentPhotos = existingListing.additional_photos || [];

      // Handle image deletions if any
      if (req.body.imagesToDelete) {
        try {
          const imagesToDelete = JSON.parse(req.body.imagesToDelete);
          // Filter out images that should be deleted
          currentPhotos = currentPhotos.filter(
            (url) => !imagesToDelete.includes(url)
          );

          // Optionally: Delete images from Cloudinary
          // This would require extracting public_ids from URLs and using cloudinary.uploader.destroy()
          // We'll skip this for now as it requires additional work to extract IDs
        } catch (parseError) {
          console.error("Error parsing imagesToDelete:", parseError);
          // Continue with the update even if parsing fails
        }
      }

      // Handle new image uploads if any
      let newImageUrls = [];
      if (req.files && req.files.newImages) {
        const newImages = Array.isArray(req.files.newImages)
          ? req.files.newImages
          : [req.files.newImages];

        for (const image of newImages) {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "listings/",
          });
          newImageUrls.push(result.secure_url);
        }
      }

      // Combine existing (not deleted) photos with new ones
      const updatedPhotos = [...currentPhotos, ...newImageUrls];

      // Create update object
      const updateData = { ...req.body };

      // Remove imagesToDelete from the data we're saving to MongoDB
      if (updateData.imagesToDelete) {
        delete updateData.imagesToDelete;
      }

      // Set the updated photo list
      updateData.additional_photos = updatedPhotos;

      // Parse boolean values properly
      if (updateData.wifi !== undefined)
        updateData.wifi = updateData.wifi === "true";
      if (updateData.pets_allowed !== undefined)
        updateData.pets_allowed = updateData.pets_allowed === "true";
      if (updateData.furnished !== undefined)
        updateData.furnished = updateData.furnished === "true";
      if (updateData.utilities_included !== undefined)
        updateData.utilities_included =
          updateData.utilities_included === "true";
      if (updateData.parking !== undefined)
        updateData.parking = updateData.parking === "true";
      if (updateData.laundry !== undefined)
        updateData.laundry = updateData.laundry === "true";
      if (updateData.maps_included !== undefined)
        updateData.maps_included = updateData.maps_included === "true";

      // Handle numeric values
      if (updateData.bedrooms)
        updateData.no_of_rooms = parseInt(updateData.bedrooms);
      if (updateData.bathrooms)
        updateData.no_of_bathrooms = parseInt(updateData.bathrooms);
      if (updateData.rent) updateData.rent = parseFloat(updateData.rent);
      if (updateData.maps_included) {
        if (updateData.latitude)
          updateData.latitude = parseFloat(updateData.latitude);
        if (updateData.longitude)
          updateData.longitude = parseFloat(updateData.longitude);
      }

      const listing = await Listing.findOneAndUpdate(
        { _id: id, user_id: userId },
        updateData,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Listing updated successfully",
        listing,
      });
    } catch (error) {
      console.error("Update listing error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update listing",
        error: error.message,
      });
    }
  }
}

export default ListingController;
