import React from 'react';
import { CameraIcon, ScreenIcon, MicIcon, MicOffIcon } from './icons/IconComponents';

interface ControlButtonProps {
    onClick: () => void;
    isActive: boolean;
    activeClass: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const ControlButton: React.FC<ControlButtonProps> = ({
    onClick,
    isActive,
    activeClass,
    icon,
    children
}) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300
            ${isActive ? activeClass : 'bg-dark-tertiary text-light-gray hover:bg-medium-gray/50'}
        `}
    >
        {icon}
        <span>{children}</span>
    </button>
);

interface BottomBarProps {
    isCameraOn: boolean;
    onToggleCamera: () => void;
    isScreenSharing: boolean;
    onToggleScreenSharing: () => void;
    isMuted: boolean;
    onToggleMute: () => void;
}


export const BottomBar: React.FC<BottomBarProps> = ({
    isCameraOn,
    onToggleCamera,
    isScreenSharing,
    onToggleScreenSharing,
    isMuted,
    onToggleMute,
}) => {
  return (
    <div className="bg-dark-primary/80 backdrop-blur-sm border-t border-dark-tertiary p-3 flex justify-center items-center shadow-lg z-20">
      <div className="flex items-center space-x-4">
        <ControlButton
            onClick={onToggleCamera}
            isActive={isCameraOn}
            activeClass="bg-blue-600 text-white shadow-lg"
            icon={<CameraIcon className="w-5 h-5" />}
        >
          {isCameraOn ? 'Kameranı Kapat' : 'Kameranı Aç'}
        </ControlButton>
        <ControlButton
            onClick={onToggleScreenSharing}
            isActive={isScreenSharing}
            activeClass="bg-purple-600 text-white shadow-lg"
            icon={<ScreenIcon className="w-5 h-5" />}
        >
          {isScreenSharing ? 'Paylaşımı Durdur' : 'Ekranını Paylaş'}
        </ControlButton>
        <ControlButton
            onClick={onToggleMute}
            isActive={!isMuted}
            activeClass="bg-green-500 text-white shadow-lg"
            icon={isMuted ? <MicOffIcon className="w-5 h-5"/> : <MicIcon className="w-5 h-5" />}
        >
          {isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        </ControlButton>
      </div>
    </div>
  );
};