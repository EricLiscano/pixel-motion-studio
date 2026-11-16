import { beforeAll, describe, expect, it } from 'vitest';
import { parseProject, serializeProject } from '../project';
beforeAll(()=>{if(!globalThis.ImageData)(globalThis as any).ImageData=class{data:Uint8ClampedArray;width:number;height:number;constructor(a:number|Uint8ClampedArray,w:number,h?:number){this.width=typeof a==='number'?a:w;this.height=typeof a==='number'?w:h!;this.data=typeof a==='number'?new Uint8ClampedArray(a*w*4):new Uint8ClampedArray(a)}}});
describe('PixelMotion project files',()=>{
 it('round-trips frames and project settings',()=>{const frames=Array.from({length:4},()=>new ImageData(16,16));frames[0].data[3]=255;const saved=serializeProject(16,12,frames,'blue car');const opened=parseProject(JSON.stringify(saved));expect(opened.size).toBe(16);expect(opened.fps).toBe(12);expect(opened.prompt).toBe('blue car');expect(opened.frames).toHaveLength(4);expect(opened.frames[0].data[3]).toBe(255)});
 it('rejects unsupported/corrupt files',()=>{expect(()=>parseProject('{bad')).toThrow();expect(()=>parseProject(JSON.stringify({format:'pixelmotion',version:1,size:16,frames:[[1]],fps:8}))).toThrow()});
});
