'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { gamesData, toolsData, othersData } from './data';
import TransitionLink from '@/components/TransitionLink';
import IconLink from '@/components/IconLink';

const folders = [
  { id: 'Home', type:"link", href:"/", icon: '/images/projects/icons/home.png',},
  { id: 'Games', type:"window", icon: '/images/projects/icons/folder.png' },
  { id: 'Tools', type:"window", icon: '/images/projects/icons/folder.png' },
  { id: 'Others', type:"window", icon: '/images/projects/icons/folder.png' },
  { id: 'itch.io', type:"link", href:"https://lenicon.itch.io/", icon: '/images/projects/icons/itchio.svg',},
  { id: 'Github', type:"link", href:"https://github.com/Lenicon", icon: '/images/projects/icons/github.svg',},
] as const;

type FolderId = typeof folders[number]['id'];

const projectsData = {
  "itch.io":[],
  "Github":[],
  "Home": [],
  Games: gamesData,
  Tools: toolsData,
  Others: othersData
};

type Position = { x: number; y: number };
type Size = { w: number; h: number };
type IconState = { id: FolderId; pos: Position };
type WindowState = { id: FolderId; pos: Position; size: Size; z: number };

type HoveredProjectState = {
  windowId: FolderId;
  name: string;
  date: string;
  desc: string;
} | null;

export default function Page() {
  // --- STATE ---
  const [icons, setIcons] = useState<IconState[]>([
    { id: 'Home', pos: { x: 40, y: 40 } },
    { id: 'itch.io', pos: { x: 40, y: 140 } },
    { id: 'Github', pos: { x: 40, y: 240 } },
    { id: 'Games', pos: { x: 140, y: 40 } },
    { id: 'Tools', pos: { x: 140, y: 140 } },
    { id: 'Others', pos: { x: 140, y: 240 } },
  ]);

  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [highestZ, setHighestZ] = useState(10);
  
  const [hoveredProject, setHoveredProject] = useState<HoveredProjectState>(null);

  const [dragging, setDragging] = useState<{ 
    id: FolderId; 
    type: 'icon' | 'window' | 'resize'; 
    offsetX: number; 
    offsetY: number 
  } | null>(null);

  // --- WINDOW MANAGEMENT ---
  const openWindow = (id: FolderId) => {
    if (openWindows.find((w) => w.id === id)) {
      focusWindow(id); 
      return;
    }
    const newZ = highestZ + 1;
    setHighestZ(newZ);

    const defaultWidth = 500;
    const defaultHeight = 350;

    const centerX = typeof window !== 'undefined' ? (window.innerWidth - defaultWidth) / 2 : 200;
    const centerY = typeof window !== 'undefined' ? (window.innerHeight - defaultHeight) / 2 : 200;

    const offset = openWindows.length * 40; 
    setOpenWindows([...openWindows, { 
      id, 
      pos: {
        x: centerX + offset,
        y: centerY + offset 
      }, 
      size: { w: 500, h: 350 },
      z: newZ 
    }]);
  };

  const closeWindow = (id: FolderId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setHoveredProject(null); // Clear tooltip if window closes
  };

  const focusWindow = (id: FolderId) => {
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z: newZ } : w)));
  };

  // --- DRAG AND RESIZE ---
  const handlePointerDown = (
    e: React.PointerEvent, 
    id: FolderId, 
    type: 'icon' | 'window' | 'resize', 
    currentPos: Position, 
    currentSize?: Size
  ) => {
    if (type === 'window' || type === 'resize') focusWindow(id);
    e.preventDefault();
    
    e.currentTarget.setPointerCapture(e.pointerId);
    
    setDragging({
      id,
      type,
      offsetX: type === 'resize' && currentSize ? e.clientX - currentSize.w : e.clientX - currentPos.x,
      offsetY: type === 'resize' && currentSize ? e.clientY - currentSize.h : e.clientY - currentPos.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent, id: FolderId, type: 'icon' | 'window' | 'resize') => {
    if (!dragging || dragging.id !== id || dragging.type !== type) return;
    e.preventDefault();

    if (type === 'resize') {
      const newWidth = Math.max(300, e.clientX - dragging.offsetX); // LARGER MINIMUM WIDTH
      const newHeight = Math.max(200, e.clientY - dragging.offsetY); // LARGER MINIMUM HEIGHT
      setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size: { w: newWidth, h: newHeight } } : w)));
    } else {
      const newPos = {
        x: e.clientX - dragging.offsetX,
        y: e.clientY - dragging.offsetY,
      };
      if (type === 'window') {
        setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, pos: newPos } : w)));
      } else {
        setIcons((prev) => prev.map((i) => (i.id === id ? { ...i, pos: newPos } : i)));
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (dragging?.type === 'icon') {
      const GRID_SIZE = 100;
      const START_OFFSET = 40;
      
      setIcons((prev) =>
        prev.map((i) => {
          if (i.id === dragging.id) {
            const snappedX = Math.round((i.pos.x - START_OFFSET) / GRID_SIZE) * GRID_SIZE + START_OFFSET;
            const snappedY = Math.round((i.pos.y - START_OFFSET) / GRID_SIZE) * GRID_SIZE + START_OFFSET;
            
            return {
              ...i,
              pos: { 
                x: Math.max(START_OFFSET, snappedX), 
                y: Math.max(START_OFFSET, snappedY) 
              },
            };
          }
          return i;
        })
      );
    }

    setDragging(null);
  };

  useEffect(()=>{
    openWindow('Games');
  },[]);

  return (
    <div className="min-h-screen w-full p-4 relative overflow-hidden select-none">

      {/* DESKTOP ICONS */}
      {icons.map((icon) => {
        const folder = folders.find((f) => f.id === icon.id)!;

        const isDragging = dragging?.id === icon.id && dragging?.type === 'icon';
        
        const iconStyles = { 
          left: icon.pos.x, 
          top: icon.pos.y,
          zIndex: isDragging ? 9999 : 10 
        };

        const IconInnerContent = (
          <>
            <div className="w-12 h-12 flex items-center justify-center group-active:opacity-70 group-hover:bg-blue-800/30 p-1">
              <img 
                src={folder.icon} 
                alt={folder.id}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            <span className={`text-base truncate group-active:text-white px-1 mt-1 ${
                  isDragging 
                    ? 'bg-blue-800 text-white'
                    : 'text-black bg-transparent group-hover:text-black'
                }`}>
              {folder.id}
            </span>
          </>
        );

        return folder.type === 'link' ? (
          folder.href.startsWith("http") ? (
            <IconLink key={icon.id}
            href={folder.href}
            className="w-15 absolute flex flex-col items-center gap-1 group touch-none cursor-pointer"
            style={iconStyles}
            onPointerDown={(e:any) => handlePointerDown(e, icon.id, 'icon', icon.pos)}
            onPointerMove={(e:any) => handlePointerMove(e, icon.id, 'icon')}
            onPointerUp={handlePointerUp}>{IconInnerContent}</IconLink>
          ) : (
          <TransitionLink
            key={icon.id}
            href={folder.href}
            className="w-15 absolute flex flex-col items-center gap-1 group touch-none cursor-pointer"
            backgroundStyle='background-space'
            style={iconStyles}
            onPointerDown={(e:any) => handlePointerDown(e, icon.id, 'icon', icon.pos)}
            onPointerMove={(e:any) => handlePointerMove(e, icon.id, 'icon')}
            onPointerUp={handlePointerUp}
          > {IconInnerContent}</TransitionLink>
          )
        ) : (
          <div
            key={icon.id}
            className="w-15 absolute flex flex-col items-center gap-1 group touch-none cursor-pointer"
            style={iconStyles}
            onDoubleClick={() => openWindow(folder.id as Exclude<FolderId, 'Home'>)}
            onPointerDown={(e) => handlePointerDown(e, icon.id, 'icon', icon.pos)}
            onPointerMove={(e) => handlePointerMove(e, icon.id, 'icon')}
            onPointerUp={handlePointerUp}
          >
            {IconInnerContent}
          </div>
        );
      })}
      

      {/* OPENED WINDOWS */}
      {openWindows.map((win) => (
        <div
          key={win.id}
          className="absolute bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black shadow-lg flex flex-col min-w-0 min-h-0"
          style={{ 
            left: win.pos.x, 
            top: win.pos.y, 
            width: win.size.w, 
            height: win.size.h, 
            zIndex: win.z 
          }}
          onPointerDown={() => focusWindow(win.id)} 
        >
          {/* Title Bar */}
          <div
            className="bg-[#000080] text-white px-3 py-2 flex justify-between items-center cursor-default touch-none flex-shrink-0"
            onPointerDown={(e) => handlePointerDown(e, win.id, 'window', win.pos)}
            onPointerMove={(e) => handlePointerMove(e, win.id, 'window')}
            onPointerUp={handlePointerUp}
          >

            <span className="font-bold text-base tracking-wide">C:\Desktop\{win.id}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(win.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-[#c0c0c0] text-black font-bold h-7 w-7 flex items-center justify-center border-2 border-t-white border-l-white border-b-gray-800 border-r-gray-800 active:border-t-black active:border-l-black active:border-b-white active:border-r-white cursor-pointer text-xl"
            >
              x
            </button>
          </div>

          {/* Window */}
          <div 
            className="
              flex-1 
              p-5 
              flex 
              flex-wrap 
              gap-8 
              content-start 
              items-start 
              bg-white 
              m-1 
              border-2 
              border-t-gray-800 
              border-l-gray-800 
              border-b-white 
              border-r-white 
              relative
              overflow-y-auto 
              overflow-x-hidden

              [&::-webkit-scrollbar]:w-5
              [&::-webkit-scrollbar-track]:bg-[#dfdfdf]
              [&::-webkit-scrollbar-track]:border-l
              [&::-webkit-scrollbar-track]:border-l-gray-400
              [&::-webkit-scrollbar-thumb]:bg-[#c0c0c0]
              [&::-webkit-scrollbar-thumb]:border-2
              [&::-webkit-scrollbar-thumb]:border-t-white
              [&::-webkit-scrollbar-thumb]:border-l-white
              [&::-webkit-scrollbar-thumb]:border-b-gray-700
              [&::-webkit-scrollbar-thumb]:border-r-gray-700
              active:[&::-webkit-scrollbar-thumb]:border-t-gray-700
              active:[&::-webkit-scrollbar-thumb]:border-l-gray-700
              active:[&::-webkit-scrollbar-thumb]:border-b-white
              active:[&::-webkit-scrollbar-thumb]:border-r-white
            "
          >
            {projectsData[win.id]?.length > 0 ? (
              projectsData[win.id].map((project) => (
                <div 
                  key={project.id} 
                  className="relative flex flex-col items-center w-20 flex-shrink-0 hover:text-white group"
                  onMouseEnter={() => setHoveredProject({
                    windowId: win.id,
                    name: project.name,
                    date: project.date,
                    desc: project.desc 
                  })}
                  onMouseLeave={() => setHoveredProject(null)}
                >

                  <Link href={project.link} target="_blank" rel="noopener noreferrer" className=" hover:bg-blue-800 hover:text-white flex flex-col items-center w-full">
                    <div className="w-12 h-12 flex items-center justify-center mb-1">
                      <img 
                        src={project.icon} 
                        alt={project.name}
                        className={"w-full h-full object-contain"+(project.blackbg==true?" bg-black group-hover:bg-blue-800":"")}
                        draggable={false}
                      />
                    </div>
                    <span className="text-sm text-black text-center px-1 mt-1 truncate w-full group-hover:text-white">
                      {project.name}
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-base">This folder is empty.</p>
            )}
          </div>

          {hoveredProject && hoveredProject.windowId === win.id && (
            <div className="absolute left-2 bottom-full mb-2 w-[calc(100%-1rem)] max-w-[30rem] bg-[#ffffe1] border border-black text-black p-3 z-[9999] shadow-md pointer-events-none">
              <span className='flex justify-between font-bold text-base'>
                <span>{hoveredProject.name}</span>
                <span>{hoveredProject.date}</span>
              </span>
              <p className="whitespace-pre-line mt-2 text-base text-justify">{hoveredProject.desc}</p>
            </div>
          )}


          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize touch-none z-50 flex items-end justify-end p-[2px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              handlePointerDown(e, win.id, 'resize', win.pos, win.size);
            }}
            onPointerMove={(e) => handlePointerMove(e, win.id, 'resize')}
            onPointerUp={handlePointerUp}
          >

            <svg width="14" height="14" viewBox="0 0 10 10" className="text-gray-600 fill-current opacity-70">
              <path d="M10,0 L0,10 L10,10 Z M7,3 L3,7 L7,7 Z M4,6 L1,9 L4,9 Z" />
            </svg>
          </div>

        </div>
      ))}

    </div>
  );
}