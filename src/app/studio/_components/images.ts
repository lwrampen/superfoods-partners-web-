"use client";
import { api } from "./api";

export const MAX_INPUT = 15 * 1024 * 1024; // 15 MB
const MAX_EDGE = 2400;
const MAX_UPLOAD = 4.3 * 1024 * 1024;

export class ImageError extends Error {}

function toBlob(canvas: HTMLCanvasElement, type: string, q: number) {
  return new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));
}

/** resize in the browser: longest side ≤ 2400 px, WebP (JPEG where the browser cannot write WebP), quality ~0.82 */
export async function resizeImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  if (!/^image\//.test(file.type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) throw new ImageError(`“${file.name}” is not an image.`);
  if (file.size > MAX_INPUT) throw new ImageError(`“${file.name}” is ${(file.size / 1024 / 1024).toFixed(1)} MB. The maximum is 15 MB — export a smaller version and try again.`);
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new ImageError(`“${file.name}” could not be read. Use a JPEG, PNG or WebP photo (iPhone HEIC: export as JPEG first).`);
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const width = Math.round(bmp.width * scale);
  const height = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, width, height);
  bmp.close();
  for (const q of [0.82, 0.74, 0.65, 0.55]) {
    let blob = await toBlob(canvas, "image/webp", q);
    if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", q);
    if (blob && blob.size <= MAX_UPLOAD) return { blob, width, height };
  }
  throw new ImageError(`“${file.name}” is still too large after resizing. Try a different photo.`);
}

/** resize + upload; returns the Studio media URL and the final size */
export async function uploadImage(postId: string, file: File) {
  const { blob, width, height } = await resizeImage(file);
  const form = new FormData();
  form.append("postId", postId);
  form.append("name", file.name);
  form.append("file", new File([blob], file.name.replace(/\.[^.]+$/, "") + (blob.type === "image/webp" ? ".webp" : ".jpg"), { type: blob.type }));
  const { src } = await api<{ src: string }>("/api/studio/upload", { form });
  return { src, width, height };
}
