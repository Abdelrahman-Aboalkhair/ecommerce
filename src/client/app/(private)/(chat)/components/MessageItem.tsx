"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Clock, Download, Play, Pause } from "lucide-react";
import Image from "next/image";

interface MessageItemProps {
  message: any;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  showTime?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
  showAvatar = true,
  showTime = true,
  isFirstInGroup = true,
  isLastInGroup = true
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioDuration, setAudioDuration] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAudioLoad = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatAudioDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessageContent = () => {
    if (message.file) {
      const fileType = message.file.type;
      
      if (fileType.startsWith('image/')) {
        return (
          <div className="space-y-2">
            {message.content && (
              <p className="text-sm text-gray-700">{message.content}</p>
            )}
            <div className="relative group">
              <Image
                src={message.file.url}
                alt="Message attachment"
                width={200}
                height={200}
                className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.file.url, '_blank')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                <Download size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        );
      }
      
      if (fileType.startsWith('audio/')) {
        return (
          <div className="space-y-2">
            {message.content && (
              <p className="text-sm text-gray-700">{message.content}</p>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <button
                onClick={toggleAudio}
                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div className="flex-1">
                <div className="text-sm font-medium">Voice Message</div>
                <div className="text-xs text-gray-500">
                  {formatAudioDuration(audioDuration)}
                </div>
              </div>
              <audio
                ref={audioRef}
                src={message.file.url}
                onLoadedMetadata={handleAudioLoad}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          </div>
        );
      }
      
      // Generic file
      return (
        <div className="space-y-2">
          {message.content && (
            <p className="text-sm text-gray-700">{message.content}</p>
          )}
          <a
            href={message.file.url}
            download
            className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download size={16} />
            <span className="text-sm font-medium">{message.file.name}</span>
          </a>
        </div>
      );
    }
    
    return (
      <p className="text-sm text-gray-700 whitespace-pre-wrap">
        {message.content}
      </p>
    );
  };

  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {showAvatar && (
        <div className={`flex-shrink-0 ${isCurrentUser ? 'order-2' : 'order-1'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      )}
      
      {/* Message Content */}
      <div className={`flex flex-col ${isCurrentUser ? 'items-end order-1' : 'items-start order-2'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`px-4 py-2 rounded-2xl max-w-full ${
            isCurrentUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
          } ${
            isFirstInGroup && isLastInGroup
              ? 'rounded-2xl'
              : isFirstInGroup
              ? isCurrentUser
                ? 'rounded-tr-md'
                : 'rounded-tl-md'
              : isLastInGroup
              ? isCurrentUser
                ? 'rounded-br-md'
                : 'rounded-bl-md'
              : 'rounded-md'
          }`}
        >
          {renderMessageContent()}
        </motion.div>
        
        {/* Time */}
        {showTime && (
          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}>
            <Clock size={12} />
            <span>{formatTime(message.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
