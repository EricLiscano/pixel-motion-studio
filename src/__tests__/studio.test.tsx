import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../studio';

beforeEach(()=>{
  if(!globalThis.ImageData)(globalThis as any).ImageData=class{data:Uint8ClampedArray;width:number;height:number;constructor(a:number|Uint8ClampedArray,w:number,h?:number){this.width=typeof a==='number'?a:w;this.height=typeof a==='number'?w:h!;this.data=typeof a==='number'?new Uint8ClampedArray(a*w*4):new Uint8ClampedArray(a)}};
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({putImageData:vi.fn(),drawImage:vi.fn(),clearRect:vi.fn(),getImageData:vi.fn(()=>new ImageData(32,32)),fillRect:vi.fn(),set imageSmoothingEnabled(_v:boolean){}} as any);
});
afterEach(()=>{cleanup();vi.restoreAllMocks()});

describe('PixelMotion editor',()=>{
 it('selects timeline frames and changes canvas resolution',()=>{render(<App/>);fireEvent.click(screen.getByRole('button',{name:'02'}));expect(screen.getByText(/FRAME 02 \/ 6/)).toBeTruthy();fireEvent.change(screen.getByRole('combobox'),{target:{value:'64'}});expect(screen.getByText(/64 × 64 px/)).toBeTruthy()});
 it('shows a waiting preview during generation and replaces it with returned frames',async()=>{
  let resolveFetch!:(value:any)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise(resolve=>resolveFetch=resolve)));
  render(<App/>);fireEvent.change(screen.getByPlaceholderText('Describe your character…'),{target:{value:'a red car'}});fireEvent.click(screen.getByRole('button',{name:/Generate Pixel Art/}));
  expect(screen.getByRole('status').textContent).toContain('Codex está diseñando');expect(screen.getByLabelText('Vista previa en preparación')).toBeTruthy();
  const rows=Array(32).fill('1'.repeat(32));resolveFetch({ok:true,json:async()=>({palette:['#ff0000'],frames:Array.from({length:6},()=>rows)})});
  await waitFor(()=>expect(screen.queryByRole('status')).toBeNull());expect(screen.getByText(/FRAME 01 \/ 6/)).toBeTruthy();
 });
});
