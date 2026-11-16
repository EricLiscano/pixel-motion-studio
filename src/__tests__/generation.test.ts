import { beforeAll, describe, expect, it } from 'vitest';
import { decodeSpriteFrames, validateSpriteResult } from '../generation';

beforeAll(() => { if (!globalThis.ImageData) (globalThis as any).ImageData = class { data: Uint8ClampedArray; width: number; height: number; constructor(width:number,height:number){this.width=width;this.height=height;this.data=new Uint8ClampedArray(width*height*4)} }; });

function validResult(size = 4, count = 4) {
  return { palette: ['#ff0000'], frames: Array.from({ length: count }, () => Array(size).fill('1000')) };
}

describe('Codex sprite response', () => {
  it.each([4, 6, 8])('accepts exactly %i frames', count => {
    expect(validateSpriteResult(validResult(4, count), 4, count).frames).toHaveLength(count);
  });
  it('rejects wrong frame counts', () => expect(() => validateSpriteResult(validResult(4, 6), 4, 4)).toThrow(/inválido/));
  it('rejects malformed rows and colors', () => {
    const result = validResult(); result.frames[0][0] = '10x0';
    expect(() => validateSpriteResult(result, 4, 4)).toThrow();
    expect(() => validateSpriteResult({ ...validResult(), palette: ['red'] }, 4, 4)).toThrow();
  });
  it('decodes palette colors to RGBA and preserves transparent zero pixels', () => {
    const frames = decodeSpriteFrames(validResult(), 4);
    expect(frames).toHaveLength(4);
    expect([...frames[0].data.slice(0, 4)]).toEqual([255, 0, 0, 255]);
    expect([...frames[0].data.slice(4, 8)]).toEqual([0, 0, 0, 0]);
  });
});
