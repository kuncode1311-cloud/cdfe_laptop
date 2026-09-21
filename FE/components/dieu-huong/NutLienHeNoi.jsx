'use client';
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
export default function NutLienHeNoi() {
    return (<aside className="fixed left-3 bottom-6 z-40 flex flex-col gap-2.5">
      {/* Zalo Button */}
      <a href="https://zalo.me/0948377979" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-[#0068ff] text-white flex items-center justify-center font-black text-xs shadow-lg hover:scale-110 transition-transform cursor-pointer" title="Chat Zalo hỗ trợ">
        <span className="font-extrabold text-sm">Zalo</span>
      </a>

      {/* Hotline Call Button */}
      <a href="tel:0948377979" className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer animate-pulse" title="Gọi điện Hotline">
        <Phone className="w-5 h-5 fill-white"/>
      </a>

      {/* Messenger Button */}
      <a href="https://m.me/laptopnew.vn" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00b2fe] to-[#006aff] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer" title="Chat Facebook Messenger">
        <MessageCircle className="w-5 h-5 fill-white"/>
      </a>
    </aside>);
}
