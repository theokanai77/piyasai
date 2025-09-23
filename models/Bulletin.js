import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// BULLETIN SCHEMA
const bulletinSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    timestamps: [
      {
        time: {
          type: String,
          required: true,
          trim: true,
          // Validate time format (HH:MM or H:MM)
          validate: {
            validator: function (v) {
              return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Time must be in format HH:MM (e.g., "00:01", "02:29")',
          },
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        videoUrl: {
          type: String,
          required: true,
          trim: true,
          // Basic URL validation
          validate: {
            validator: function (v) {
              return /^https?:\/\/.+/.test(v);
            },
            message: "VideoUrl must be a valid HTTP/HTTPS URL",
          },
        },
      },
    ],
    channelId: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
      // Basic URL validation
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "VideoUrl must be a valid HTTP/HTTPS URL",
      },
    },
    publishDate: {
      type: Date,
      required: true,
    },
    // Optional fields for additional metadata
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    duration: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Index for better query performance
bulletinSchema.index({ channelId: 1, publishDate: -1 });
bulletinSchema.index({ title: "text", summary: "text" });

// Virtual for timestamp count
bulletinSchema.virtual("timestampCount").get(function () {
  return this.timestamps ? this.timestamps.length : 0;
});

// Instance method to get formatted publish date
bulletinSchema.methods.getFormattedDate = function () {
  return this.publishDate.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Static method to find bulletins by channel
bulletinSchema.statics.findByChannel = function (channelId) {
  return this.find({ channelId, isActive: true }).sort({ publishDate: -1 });
};

// Static method to find recent bulletins
bulletinSchema.statics.findRecent = function (limit = 10) {
  return this.find({ isActive: true }).sort({ publishDate: -1 }).limit(limit);
};

// Static method to search bulletins
bulletinSchema.statics.search = function (searchTerm) {
  return this.find({
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { summary: { $regex: searchTerm, $options: "i" } },
      { channelId: { $regex: searchTerm, $options: "i" } },
    ],
  }).sort({ publishDate: -1 });
};

// add plugin that converts mongoose to json
bulletinSchema.plugin(toJSON);

export default mongoose.models.Bulletin ||
  mongoose.model("Bulletin", bulletinSchema);
