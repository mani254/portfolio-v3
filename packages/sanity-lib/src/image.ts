import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export const getImageUrl = (
  imageRef: any,
  width = 1200,
  format: "webp" | "jpg" | "png" = "webp"
): string => {
  if (!imageRef) return "";

  // if already a string, return it
  if (typeof imageRef === 'string') return imageRef;

  try {
    const source = imageRef.asset?._ref
      ? imageRef
      : { _type: "reference", _ref: imageRef };

    return builder.image(source).width(width).format(format).quality(85).url();
  } catch (error) {
    console.error("Error generating image URL:", error);
    return "";
  }
};
