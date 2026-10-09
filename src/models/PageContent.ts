import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Supported content types for editable visual elements
 */
export type PageContentType = "text" | "image";

/**
 * Core interface for a page content override record in MongoDB
 */
export interface IPageContent {
  key: string;
  page: string;
  section: string;
  type: PageContentType;
  content: string;
  fontFamily?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose Document type extending IPageContent
 */
export interface IPageContentDocument extends IPageContent, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Client and API Data Transfer Object (DTO) matching PROJECT.md contract
 */
export interface ElementOverride {
  key: string;
  page: string;
  section: string;
  type: PageContentType;
  content: string;
  fontFamily?: string;
  color?: string;
  updatedAt?: Date | string;
}

/**
 * Dictionary map for fast client lookup (Record<string, ElementOverride>)
 */
export type PageContentMap = Record<string, ElementOverride>;

/**
 * API Response contract for GET /api/content
 */
export interface ContentGetResponse {
  success: boolean;
  data: PageContentMap;
  message?: string;
}

/**
 * API Request contract for POST /api/content
 */
export interface ContentBatchPostRequest {
  items: ElementOverride[];
}

/**
 * API Response contract for POST /api/content
 */
export interface ContentPostResponse {
  success: boolean;
  count: number;
  message?: string;
}

const PageContentSchema = new Schema<IPageContentDocument>(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      index: true,
      trim: true,
    },
    page: {
      type: String,
      required: [true, "Page identifier is required"],
      index: true,
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section identifier is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Content type is required"],
      enum: {
        values: ["text", "image"],
        message: "{VALUE} is not a valid content type",
      },
      default: "text",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      validate: {
        validator: (v: any) => typeof v === "string",
        message: "Content must be a string",
      },
    },
    fontFamily: {
      type: String,
      default: undefined,
      trim: true,
    },
    color: {
      type: String,
      default: undefined,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Allow empty string "" for content while maintaining requirement check for null/undefined/missing values
(PageContentSchema.path("content") as any).checkRequired = function (v: any) {
  return typeof v === "string";
};

// Prevent model recompilation in Next.js hot reload / Fast Refresh environments
const PageContent: Model<IPageContentDocument> =
  (mongoose.models.PageContent as Model<IPageContentDocument>) ||
  mongoose.model<IPageContentDocument>("PageContent", PageContentSchema);

export default PageContent;
