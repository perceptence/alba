import { useState, useEffect } from "react";
import { RES } from "@/lib/data";

/* Autopay domain: available methods and current settings, subscribe-able. */
export const apStore = (() => {
  const methods=[{id:"cnb",bank:"City National",type:"Checking",last4:"4291"},{id:"chase",bank:"Chase",type:"Checking",last4:"8801"}];
  let st={on:true,methodId:"cnb",day:1,amount:RES.rent};
  const subs=new Set();const emit=()=>subs.forEach(f=>f());
  return {get:()=>({...st,method:methods.find(m=>m.id===st.methodId)}),methods:()=>methods,
    subscribe:(f)=>{subs.add(f);return()=>subs.delete(f);},
    setOn:(v)=>{st={...st,on:v};emit();},setMethod:(id)=>{st={...st,methodId:id};emit();}};
})();

export function useAp() {const[,f]=useState(0);useEffect(()=>apStore.subscribe(()=>f(n=>n+1)),[]);return apStore;}
