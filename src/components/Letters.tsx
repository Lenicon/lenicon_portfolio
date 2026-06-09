'use client';

import React, { useState, useEffect, useRef } from 'react';
import { submitLetter, getHighestShardId, fetchShardLetters, Letter } from '@/lib/letters';

export default function Letters({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('#97f9f9'); // Default solid color
  const [letters, setLetters] = useState<Letter[]>([]);
  const [currentShard, setCurrentShard] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function initLetters() {
      setLoading(true);
      try {
        const highestId = await getHighestShardId();
        setCurrentShard(highestId);
        const data = await fetchShardLetters(highestId);
        setLetters(data.reverse()); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initLetters();
  }, []);

  const loadMore = async () => {
    if (currentShard === null || currentShard <= 1) return;
    setLoading(true);
    try {
      const nextShardId = currentShard - 1;
      const data = await fetchShardLetters(nextShardId);
      setLetters((prev) => [...prev, ...data.reverse()]);
      setCurrentShard(nextShardId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!username.trim() || !message.trim() || submitting) return;

    setSubmitting(true);
    try {
      await submitLetter(username, message, color);
      
      const localNewLetter: Letter = {
        username,
        message,
        color,
        date: new Date().toISOString()
      };
      setLetters((prev) => [localNewLetter, ...prev]);
      setMessage('');
    } catch (err) {
      alert("Failed to submit comment!");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm select-text">
      <div className="bg-white border-2 border-[var(--pink)] w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-[var(--pink)] bg-[var(--pink)] flex justify-between items-center">
          <h2 className="font-fredoka font-black text-red-900 text-2xl tracking-wide">WRITE A LETTER {"<3"}</h2>
          <button onClick={onClose} className="text-red-900 hover:text-black font-fredoka font-black text-xl">X</button>
        </div>

        {/* Letters */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth black-scrollbar">
          {letters.map((c, i) => (
            <div key={i} className=" flex flex-col border border-black flex">
                <div className='p-2 flex gap-2 bg-black h-full w-full' style={{ color: c.color }}>
                    <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: c.color }} />
                    <span className='font-semibold font-fredoka'>{c.username}</span>
                </div>
                <p className="py-3 px-5 break-words text-black font-fredoka text-lg leading-relaxed">"{c.message}"</p>
            </div>
          ))}

          {loading && <p className="text-center text-zinc-500 font-fredoka text-sm py-2">Gathering letters...</p>}
          
          {currentShard && currentShard > 1 && !loading && (
            <button 
              onClick={loadMore}
              className="w-full py-2 border border-dashed border-black text-black hover:text-white hover:bg-black font-fredoka text-sm mt-2"
            >
              Show older letters...
            </button>
          )}
        </div>

        {/* Letter Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--pink)] bg-[var(--pink)] space-y-3">
          <div className="flex gap-3 items-center h-10">


            <input 
                type="text" 
                placeholder="Who are you? Name? Please." 
                maxLength={15}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white border border-1 border-black px-3 py-2 h-full text-md text-black focus:outline-none w-full font-fredoka"
                required
            />
            
            {/* COLORSS!!! */}
            <div className="flex items-center h-full w-[170px] flex-shrink-0 border border-black bg-white select-text">
            
            <div 
                className="relative w-[45px] h-full cursor-pointer transition-colors duration-150 flex-shrink-0"
                style={{ backgroundColor: color.length === 7 ? color : '#ffffff' }}
            >
                <input 
                type="color" 
                value={color.length === 7 ? color : '#ffffff'} 
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0 font-fredoka"
                />
                
                <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none font-bold text-lg"
                style={{
                    color: (() => {
                    const hex = color.replace('#', '');
                    if (hex.length !== 6) return '#000000';
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
                    return brightness > 127.5 ? '#000000' : '#ffffff';
                    })()
                }}

                >C</div>
            </div>

            <div className="w-[1px] h-full bg-black flex-shrink-0" />

            <input 
                type="text" 
                maxLength={7}
                value={color}
                onChange={(e) => {
                const val = e.target.value;
                if (val.startsWith('#') || val === '') {
                    setColor(val);
                } else {
                    setColor(`#${val}`);
                }
                }}
                placeholder="#FFFFFF"
                className="flex-1 h-full px-2 text-center text-md font-fredoka tracking-wider focus:outline-none text-black bg-white min-w-0"
                required
            />

            </div>


          </div>

          <div className="flex gap-3 items-end h-16">
            <textarea 
              placeholder="Leave a message and be a lil guy, please be nice!" 
              maxLength={250}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white border border-black px-3 py-2 text-md text-black focus:outline-none w-full h-full resize-none font-fredoka"
              required
            />
            { (username.trim() && message.trim()) && 
                <button 
                type="submit" 
                disabled={submitting || !username.trim() || !message.trim()}
                className="w-[170px] tracking-wide bg-red-900 border-red-900 hover:bg-black text-white border-1 border-[var(--pink)] hover:border-black font-bold font-fredoka px-5 py-3 text-lg flex-shrink-0 h-full"
                >
                {submitting ? 'SHARING...' : 'SHARE'}
                </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
}