export type PixelProject = {format:'pixelmotion';version:1;size:number;fps:number;frames:number[][];prompt:string};
export function serializeProject(size:number,fps:number,frames:ImageData[],prompt:string):PixelProject {
  if (![16,32,48,64,128].includes(size) || frames.some(frame=>frame.width!==size||frame.height!==size)) throw new Error('Dimensiones de proyecto inválidas.');
  return {format:'pixelmotion',version:1,size,fps,frames:frames.map(frame=>Array.from(frame.data)),prompt};
}
export function parseProject(raw:string):{size:number;fps:number;prompt:string;frames:ImageData[]} {
  const p=JSON.parse(raw) as Partial<PixelProject>;
  if(p.format!=='pixelmotion'||p.version!==1||![16,32,48,64,128].includes(p.size||0)||!Array.isArray(p.frames)||![4,6,8].includes(p.frames.length)||p.frames.some(frame=>!Array.isArray(frame)||frame.length!==(p.size||0)*(p.size||0)*4)) throw new Error('Archivo PixelMotion inválido.');
  return {size:p.size!,fps:p.fps||8,prompt:p.prompt||'',frames:p.frames.map(data=>new ImageData(new Uint8ClampedArray(data),p.size!,p.size!))};
}
