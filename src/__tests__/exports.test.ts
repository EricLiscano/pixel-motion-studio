import { describe, expect, it, vi } from 'vitest';
import { GifReader } from 'omggif';
import { exportGif } from '../exports';

function frame(color: number[]) { const data = new Uint8ClampedArray([ ...color, 255, 0, 0, 0, 0 ]); return { width: 2, height: 1, data }; }

describe('GIF export', () => {
  it('encodes all frames, size, and loop metadata', () => {
    let bytes = new Uint8Array();
    const NativeBlob = globalThis.Blob;
    class BlobCapture extends NativeBlob {
      constructor(parts: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        if (options?.type === 'image/gif') bytes = new Uint8Array(parts[0] as ArrayBuffer);
      }
    }
    vi.stubGlobal('Blob', BlobCapture);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    exportGif([frame([255,0,0]), frame([0,255,0])], 8);
    const reader = new GifReader(bytes);
    expect(reader.width).toBe(2); expect(reader.height).toBe(1); expect(reader.numFrames()).toBe(2);
    vi.restoreAllMocks();
  });
});
