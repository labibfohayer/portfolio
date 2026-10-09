/**
 * Image Fixture Generator and Canvas Compressor Spec Oracle
 * Conforms to R3: Inline Image Replacement & Automatic Canvas Compression
 */

// 1x1 transparent PNG data URL
export const TINY_VALID_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// Mock 5MB high-res raw image data URL (simulating 4000x3000 photo)
export function createLargeImageFixture(width = 4000, height = 3000, approximateSizeKB = 3500) {
  // Generate dummy base64 payload of requested size
  const paddingChars = Math.round((approximateSizeKB * 1024 * 4) / 3);
  const dummyPayload = "A".repeat(paddingChars);
  return {
    dataUrl: `data:image/jpeg;base64,${dummyPayload}`,
    width,
    height,
    originalSizeBytes: approximateSizeKB * 1024,
    mimeType: "image/jpeg",
  };
}

export const CORRUPTED_DATA_URL = "data:image/jpeg;base64,THIS_IS_CORRUPTED_NOT_VALID_BASE64_%%%@@@";
export const NON_IMAGE_DATA_URL = "data:application/pdf;base64,JVBERi0xLjQKJ...";

/**
 * Calculates downscaled dimensions maintaining aspect ratio within maxDimension bounding box
 */
export function calculateAspectRatioFit(srcWidth, srcHeight, maxDimension = 1200) {
  if (srcWidth <= 0 || srcHeight <= 0) {
    throw new Error("Invalid image dimensions");
  }

  if (srcWidth <= maxDimension && srcHeight <= maxDimension) {
    return { width: Math.round(srcWidth), height: Math.round(srcHeight), scaled: false };
  }

  const ratio = Math.min(maxDimension / srcWidth, maxDimension / srcHeight);
  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio),
    scaled: true,
    scaleFactor: ratio,
  };
}

/**
 * Simulates HTML5 Canvas compression pipeline specified in PROJECT.md:
 * Max dimension 1200px, quality 0.7, targeting <200KB base64 payload.
 */
export function simulateCanvasCompression(input) {
  const {
    dataUrl,
    width = 1920,
    height = 1080,
    mimeType = "image/jpeg",
    maxDimension = 1200,
    quality = 0.7,
  } = input;

  // Validate MIME type
  const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validMimes.includes(mimeType) && !dataUrl.startsWith("data:image/")) {
    throw new Error(`Unsupported image format: ${mimeType}`);
  }

  if (dataUrl === CORRUPTED_DATA_URL) {
    throw new Error("Failed to decode image data: corrupted payload");
  }

  const dimensions = calculateAspectRatioFit(width, height, maxDimension);
  
  // Calculate simulated compressed payload size based on resolution and quality
  // Typically JPEG at 0.7 quality is ~0.15 - 0.25 bytes per pixel uncompressed
  const estimatedRawBytes = Math.round(dimensions.width * dimensions.height * 0.2 * quality);
  // Base64 expands by 4/3
  const compressedBase64Bytes = Math.min(estimatedRawBytes * 1.33, 195 * 1024); // Cap to <200KB
  const dummyCompressedBase64 = "C".repeat(Math.max(100, Math.round(compressedBase64Bytes)));

  const compressedDataUrl = `data:image/jpeg;base64,${dummyCompressedBase64}`;

  return {
    dataUrl: compressedDataUrl,
    originalWidth: width,
    originalHeight: height,
    width: dimensions.width,
    height: dimensions.height,
    quality,
    sizeBytes: compressedDataUrl.length,
    sizeKB: Math.round(compressedDataUrl.length / 1024),
    isUnder200KB: compressedDataUrl.length < 200 * 1024,
  };
}
