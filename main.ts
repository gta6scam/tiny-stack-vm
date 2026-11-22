import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs'
import{join}from'node:path'
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',E=new TextEncoder()
const T={0:0,1:17,2:65,3:4,4:6,5:10,6:11,7:15,23:5,27:5,48:32,49:36,50:36,51:32,52:0,64:5,65:8,80:4,81:4,82:1,83:4}
for(let i=16;i<35;i++)T[i]??=9
const B={16:(a,b)=>a+b,17:(a,b)=>a-b,18:(a,b)=>Math.imul(a,b),19:(a,b)=>(a/b)|0,20:(a,b)=>a%b,21:(a,b)=>((a>>>0)/(b>>>0))|0,22:(a,b)=>(a>>>0)%(b>>>0),24:(a,b)=>a&b,25:(a,b)=>a|b,26:(a,b)=>a^b,28:(a,b)=>a<<b,29:(a,b)=>a>>b,30:(a,b)=>a>>>b,32:(a,b)=>+(a==b),33:(a,b)=>+(a<b),34:(a,b)=>+((a>>>0)<(b>>>0))}
function run(p,q){
const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536),n=p.length
let s=0,k=0,l=0,j=0,pc=0,t=0,x,op
const R=e=>[o.subarray(0,l),e],H=[],rel=()=>((p[x-2]|p[x-1]<<8)<<16)>>16
const bin=()=>{let b=D[s-1];if(!b&&op>18&&op<23)return 4;D[s-2]=B[op](D[s-2],b);s--}
for(let i=16;i<35;i++)H[i]=bin
H[0]=()=>0
H[1]=()=>{D[s++]=p[x-1]<<24>>24}
H[2]=()=>{D[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24}
H[3]=()=>{s--}
H[4]=()=>{D[s]=D[s-1];s++}
H[5]=()=>{[D[s-2],D[s-1]]=[D[s-1],D[s-2]]}
H[6]=()=>{D[s]=D[s-2];s++}
H[7]=()=>{[D[s-3],D[s-2],D[s-1]]=[D[s-2],D[s-1],D[s-3]]}
H[23]=H[27]=()=>{D[s-1]=op==23?-D[s-1]:~D[s-1]}
H[48]=()=>{pc=x+rel()}
H[49]=H[50]=()=>{if((D[--s]==0)==(op==49))pc=x+rel()}
H[51]=()=>{if(k==64)return 7;C[k++]=x;pc=p[x-2]|p[x-1]<<8}
H[52]=()=>{if(!k)return 8;pc=C[--k]}
H[64]=()=>{let a=D[s-1];if(a<0||a>255)return 6;D[s-1]=M[a]}
H[65]=()=>{let a=D[s-1];if(a<0||a>255)return 6;M[a]=D[s-2];s-=2}
H[80]=()=>{let b=E.encode(String(D[s-1]));if(l+b.length>65536)return 11;s--;o.set(b,l);l+=b.length}
H[81]=()=>{if(l>65535)return 11;o[l++]=D[--s]&255}
H[82]=()=>{D[s++]=j<q.length?q[j++]:-1}
H[83]=()=>D[--s]&255
for(;;){
if(t==1e6)return R(10)
if(pc<0||pc>=n)return R(9)
op=p[pc]
let m=T[op]
if(m===undefined||op==31)return R(5)
let im=m>>4
if(pc+im>=n)return R(9)
t++
x=pc+1+im
let po=m>>2&3
if(s<po)return R(2)
if(s-po+(m&3)>256)return R(3)
pc=x
let e=H[op]()
if(e!==undefined)return R(e)
}
}
const rd=f=>{try{return readFileSync(f)}catch{return new Uint8Array}}
for(const id of readdirSync(I).sort()){
const[out,ex]=run(rd(join(I,id,'program.bin')),rd(join(I,id,'input.bin'))),d=join(O,id)
mkdirSync(d,{recursive:true})
writeFileSync(d+'/stdout.bin',out)
writeFileSync(d+'/exit.txt',ex+'\n')
}
