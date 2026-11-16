export type SpriteResult = { palette: string[]; frames: string[][] };

export function validateSpriteResult(value: unknown, size: number, count: number): SpriteResult {
  const result = value as Partial<SpriteResult> | null;
  if (!result || !Array.isArray(result.palette) || result.palette.length < 1 || result.palette.length > 8 ||
      result.palette.some(color => typeof color !== 'string' || !/^#[0-9a-f]{6}$/i.test(color)) ||
      !Array.isArray(result.frames) || result.frames.length !== count ||
      result.frames.some(frame => !Array.isArray(frame) || frame.length !== size || frame.some(row => typeof row !== 'string' || row.length !== size || /[^0-7]/.test(row)))) {
    throw new Error('Codex devolvió cuadros con un formato inválido.');
  }
  return result as SpriteResult;
}

export function decodeSpriteFrames(result: SpriteResult, size: number): ImageData[] {
  return result.frames.map(rows => {
    const image = new ImageData(size, size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const index = Number(rows[y][x]);
      if (index === 0) continue;
      const hex = result.palette[index - 1];
      if (!hex) continue;
      const offset = (y * size + x) * 4;
      image.data[offset] = parseInt(hex.slice(1, 3), 16);
      image.data[offset + 1] = parseInt(hex.slice(3, 5), 16);
      image.data[offset + 2] = parseInt(hex.slice(5, 7), 16);
      image.data[offset + 3] = 255;
    }
    return image;
  });
}
