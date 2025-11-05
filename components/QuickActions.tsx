'use client';

import { useState, useRef, useEffect } from 'react';
import AddMemberModal from './AddMemberModal';
import CreateGroupModal from './CreateGroupModal';

export default function QuickActions() {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  // Mock existing members - in a real app, this would come from props or context
  const existingMembers = [
    'sarah.johnson@commonspirit.org',
    'michael.chen@commonspirit.org',
    'emily.rodriguez@commonspirit.org',
    'david.kim@commonspirit.org',
    'jessica.martinez@commonspirit.org',
    'robert.taylor@commonspirit.org',
    'amanda.white@commonspirit.org',
    'james.wilson@commonspirit.org',
    'lisa.anderson@commonspirit.org',
    'chris.brown@commonspirit.org',
    'michelle.davis@commonspirit.org',
    'daniel.garcia@commonspirit.org',
    'jennifer.lee@commonspirit.org',
    'matthew.harris@commonspirit.org',
    'nicole.thompson@commonspirit.org',
    'andrew.moore@commonspirit.org',
    'stephanie.clark@commonspirit.org',
    'kevin.lewis@commonspirit.org',
    'rachel.walker@commonspirit.org',
    'brian.hall@commonspirit.org',
    'lauren.allen@commonspirit.org',
    'ryan.young@commonspirit.org',
    'megan.king@commonspirit.org',
    'justin.wright@commonspirit.org',
    'hannah.lopez@commonspirit.org',
    'jared.kaufman@gmail.com',
  ];

  return (
    <>
      <div className="flex gap-3 items-start relative shrink-0 w-full">
        <QuickActionCard
          icon="user-circle"
          title="Add Member"
          description="Add user's to the organization"
          circleColor="#FF7A4E"
          onClick={() => setIsAddMemberModalOpen(true)}
        />
        <QuickActionCard
          icon="users"
          title="Create Group"
          description="Set up a new access control group"
          circleColor="#7C8AF4"
          onClick={() => setIsCreateGroupModalOpen(true)}
        />
      </div>
      <AddMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)}
        existingMembers={existingMembers}
      />
      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen} 
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
    </>
  );
}

function QuickActionCard({ icon, title, description, circleColor, onClick }: { icon: string; title: string; description: string; circleColor: string; onClick?: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      mousePositionRef.current = { x, y };
      // Update smooth position immediately on first move to avoid initial delay
      setSmoothPosition(prev => {
        if (prev.x === 0 && prev.y === 0) {
          return { x, y };
        }
        return prev;
      });
    }
  };

  const handleMouseLeave = () => {
    // Keep the circle at the last position when mouse leaves
    // Don't reset - let it stay where it was
  };

  // Smooth interpolation effect
  useEffect(() => {
    const animate = () => {
      setSmoothPosition(prev => {
        const currentMouse = mousePositionRef.current;
        const dx = currentMouse.x - prev.x;
        const dy = currentMouse.y - prev.y;
        // Use a lerp factor for smoothness (0.1 = slower, higher = faster)
        const lerpFactor = 0.8;
        return {
          x: prev.x + dx * lerpFactor,
          y: prev.y + dy * lerpFactor,
        };
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Run once on mount, not on every mousePosition change

  return (
      <div 
        ref={cardRef}
        className="flex-1 bg-transparent border border-[#e3e7ea] border-solid box-border flex flex-col gap-3 grow h-[126px] items-start min-h-0 min-w-0 p-4 relative rounded-[10px] shrink-0 cursor-pointer overflow-hidden transition-colors hover:border-[#d2d8dc] hover:bg-[#f7f8f8]/50"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
      {/* Circle that follows cursor */}
      <div 
        className="absolute rounded-full pointer-events-none z-10"
        style={{
          width: '140px',
          height: '140px',
          backgroundColor: circleColor,
          opacity: 0.1,
          filter: 'blur(20px)',
          left: `${smoothPosition.x}px`,
          top: `${smoothPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div className="flex flex-col gap-4 items-start relative shrink-0 w-full z-10">
        <div className="box-border flex gap-2 items-center pb-0 pt-0.5 px-0 relative shrink-0">
          <div className="overflow-clip relative shrink-0 w-4 h-4">
            {icon === 'user-circle' ? (
              <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
          <p className="font-semibold leading-5 relative shrink-0 text-[#121313] text-sm tracking-wide w-full">
            {title}
          </p>
          <p className="font-normal h-8 leading-4 relative shrink-0 text-[#6e8081] text-xs tracking-wide w-full">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
