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
  const [icons, setIcons] = useState<IconState[]>([
    { id: 'Home', pos: { x: 20, y: 20 } },
    { id: 'itch.io', pos: { x: 20, y: 110 } },
    { id: 'Github', pos: { x: 20, y: 200 } },
    { id: 'Games', pos: { x: 110, y: 20 } },
    { id: 'Tools', pos: { x: 110, y: 110 } },
    { id: 'Others', pos: { x: 110, y: 200 } },
  ]);

  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [highestZ, setHighestZ] = useState(10);
  
  const [hoveredProject, setHoveredProject] = useState<HoveredProjectState>(null);

  const [dragging, setDragging] = useState<{ 
    id: FolderId; 
    type: 'icon' | 'window' | 'resize'; 
    offsetX: number; 
    offsetY: number;
    target: HTMLElement;
    pointerId: number;
  } | null>(null);

  // WINDOW MANAGEMENT
  const openWindow = (id: FolderId) => {
    if (openWindows.find((w) => w.id === id)) {
      focusWindow(id); 
      return;
    }
    const newZ = highestZ + 1;
    setHighestZ(newZ);

    const screenW = typeof window !== 'undefined' ? window.innerWidth : 800;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 600;

    const defaultWidth = Math.min(500, screenW - 24); 
    const defaultHeight = Math.min(350, screenH - 160);

    const centerX = Math.max(12, (screenW - defaultWidth) / 2);
    const centerY = Math.max(12, (screenH - defaultHeight) / 2);

    const offset = screenW < 640 ? 0 : (openWindows.length % 5) * 20; 
    
    setOpenWindows([...openWindows, { 
      id, 
      pos: {
        x: centerX + offset,
        y: centerY + offset 
      }, 
      size: { w: defaultWidth, h: defaultHeight },
      z: newZ 
    }]);
  };

  const closeWindow = (id: FolderId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setHoveredProject(null);
  };

  const focusWindow = (id: FolderId) => {
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z: newZ } : w)));
    setHoveredProject(null); 
  };

  // DRAG AND RESIZE
  const handlePointerDown = (
    e: React.PointerEvent, 
    id: FolderId, 
    type: 'icon' | 'window' | 'resize', 
    currentPos: Position, 
    currentSize?: Size
  ) => {
    if (type === 'window' || type === 'resize') focusWindow(id);
    e.preventDefault();
    
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    
    setDragging({
      id,
      type,
      offsetX: type === 'resize' && currentSize ? e.clientX - currentSize.w : e.clientX - currentPos.x,
      offsetY: type === 'resize' && currentSize ? e.clientY - currentSize.h : e.clientY - currentPos.y,
      target,
      pointerId: e.pointerId
    });
  };

  const handleGlobalPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();

    if (dragging.type === 'resize') {
      const minW = Math.min(180, typeof window !== 'undefined' ? window.innerWidth * 0.6 : 180);
      const minH = Math.min(150, typeof window !== 'undefined' ? window.innerHeight * 0.3 : 150);
      
      const newWidth = Math.max(minW, e.clientX - dragging.offsetX);
      const newHeight = Math.max(minH, e.clientY - dragging.offsetY);
      
      setOpenWindows((prev) => prev.map((w) => (w.id === dragging.id ? { ...w, size: { w: newWidth, h: newHeight } } : w)));
    } else {
      const newPos = {
        x: e.clientX - dragging.offsetX,
        y: e.clientY - dragging.offsetY,
      };
      if (dragging.type === 'window') {
        setOpenWindows((prev) => prev.map((w) => (w.id === dragging.id ? { ...w, pos: newPos } : w)));
      } else {
        setIcons((prev) => prev.map((i) => (i.id === dragging.id ? { ...i, pos: newPos } : i)));
      }
    }
  };

  const handleGlobalPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    
    try {
      dragging.target.releasePointerCapture(dragging.pointerId);
    } catch (err) {}

    if (dragging.type === 'icon') {
      const GRID_SIZE = 90;
      const START_OFFSET = 20;
      
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
    <div 
      className="min-h-screen w-full p-2 sm:p-4 relative overflow-hidden select-none touch-none"
      onPointerMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
      onPointerCancel={handleGlobalPointerUp}
      onClick={() => setHoveredProject(null)}
    >

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
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-active:opacity-70 group-hover:bg-blue-800/30 p-1">
              <img 
                src={folder.icon} 
                alt={folder.id}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            <span className={`text-xs sm:text-sm truncate group-active:text-white px-1 mt-0.5 max-w-full ${
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
            className="w-16 sm:w-20 absolute flex flex-col items-center text-center group touch-none cursor-pointer"
            style={iconStyles}
            onPointerDown={(e:any) => handlePointerDown(e, icon.id, 'icon', icon.pos)}
            >{IconInnerContent}</IconLink>
          ) : (
          <TransitionLink
            key={icon.id}
            href={folder.href}
            className="w-16 sm:w-20 absolute flex flex-col items-center text-center group touch-none cursor-pointer"
            backgroundStyle='background-space'
            style={iconStyles}
            onPointerDown={(e:any) => handlePointerDown(e, icon.id, 'icon', icon.pos)}
          > {IconInnerContent}</TransitionLink>
          )
        ) : (
          <div
            key={icon.id}
            className="w-16 sm:w-20 absolute flex flex-col items-center text-center group touch-none cursor-pointer"
            style={iconStyles}
            onDoubleClick={() => openWindow(folder.id as Exclude<FolderId, 'Home'>)}
            onPointerDown={(e) => handlePointerDown(e, icon.id, 'icon', icon.pos)}
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
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title Bar */}
          <div
            className="bg-[#000080] text-white px-2 py-1 sm:px-3 sm:py-2 flex justify-between items-center cursor-default touch-none flex-shrink-0"
            onPointerDown={(e) => handlePointerDown(e, win.id, 'window', win.pos)}
          >
            <span className="font-bold text-xs sm:text-base tracking-wide truncate pr-2">C:\Desktop\{win.id}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(win.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-[#c0c0c0] text-black font-bold h-5 w-5 sm:h-7 sm:w-7 flex items-center justify-center border-2 border-t-white border-l-white border-b-gray-800 border-r-gray-800 active:border-t-black active:border-l-black active:border-b-white active:border-r-white cursor-pointer text-sm sm:text-xl flex-shrink-0"
            >
              x
            </button>
          </div>

          {/* Folder Area */}
          <div 
            className="
              flex-1 
              p-2 sm:p-5 
              flex 
              flex-wrap 
              gap-4 sm:gap-8 
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

              [&::-webkit-scrollbar]:w-4 sm:[&::-webkit-scrollbar]:w-5
              ...
            "
          >
            {projectsData[win.id]?.length > 0 ? (
              projectsData[win.id].map((project) => (
                <div 
                  key={project.id} 
                  className="relative flex flex-col items-center w-16 sm:w-20 flex-shrink-0 hover:text-white group"
                  onMouseEnter={() => setHoveredProject({
                    windowId: win.id,
                    name: project.name,
                    date: project.date,
                    desc: project.desc 
                  })}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <Link 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:bg-blue-800 hover:text-white flex flex-col items-center w-full"
                    onClick={(e) => {
                      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
                      if (isTouchDevice) {
                        if (hoveredProject?.name !== project.name) {
                          e.preventDefault(); 
                          setHoveredProject({
                            windowId: win.id,
                            name: project.name,
                            date: project.date,
                            desc: project.desc 
                          });
                        }
                      }
                    }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-0.5 sm:mb-1">
                      <img 
                        src={project.icon} 
                        alt={project.name}
                        className={"w-full h-full object-contain"+(project.blackbg==true?" bg-black group-hover:bg-blue-800":"")}
                        draggable={false}
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-black text-center px-0.5 mt-0.5 truncate w-full group-hover:text-white">
                      {project.name}
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs sm:text-base">This folder is empty.</p>
            )}
          </div>

          {/* Tooltip for item description thingy */}
          {hoveredProject && hoveredProject.windowId === win.id && (
            <div className="
              fixed bottom-4 left-4 right-4 max-w-none m-0 p-3 text-xs
              sm:absolute sm:left-2 sm:bottom-full sm:mb-2 sm:w-max sm:max-w-[30rem] sm:text-sm
              bg-[#ffffe1] border border-black text-black z-[9999] shadow-md pointer-events-none
            ">
              <span className='flex justify-between font-bold gap-4 border-b border-black/20 pb-1 mb-1 sm:border-0 sm:pb-0 sm:mb-0'>
                <span>{hoveredProject.name}</span>
                <span className="opacity-80 font-normal sm:font-bold">{hoveredProject.date}</span>
              </span>
              <p className="whitespace-pre-line mt-1 sm:mt-2 text-justify break-words leading-relaxed max-h-[25vh] overflow-y-auto">
                {hoveredProject.desc}
              </p>
            </div>
          )}

          {/* Resize Corner chuhcu*/}
          <div
            className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 cursor-se-resize touch-none z-50 flex items-end justify-end p-[2px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              handlePointerDown(e, win.id, 'resize', win.pos, win.size);
            }}
          >
            <svg width="12" height="12" viewBox="0 0 10 10" className="text-gray-600 fill-current opacity-70 sm:w-3.5 sm:h-3.5">
              <path d="M10,0 L0,10 L10,10 Z M7,3 L3,7 L7,7 Z M4,6 L1,9 L4,9 Z" />
            </svg>
          </div>

        </div>
      ))}

    </div>
  );
}