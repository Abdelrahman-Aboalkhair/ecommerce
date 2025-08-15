"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Paperclip, 
  Smile, 
  X, 
  Check,
  Pause,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (file?: File, content?: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  disabled = false,
  isTyping = false
}) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Cleanup preview URL when file changes
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Recording timer
  useEffect(() => {
    if (recording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [recording]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
    }
  };

  const cancelMedia = () => {
    setSelectedFile(null);
    setAudioBlob(null);
    setPreviewUrl(null);
    if (mediaRecorder) {
      stopRecording();
    }
  };

  const confirmSend = () => {
    if (selectedFile) {
      onSendMessage(selectedFile, message);
      setSelectedFile(null);
      setPreviewUrl(null);
    } else if (audioBlob) {
      const file = new File([audioBlob], "voice_message.mp3", {
        type: "audio/mp3",
      });
      onSendMessage(file, message);
      setAudioBlob(null);
    }
    setMessage("");
  };

  const handleSend = () => {
    if (message.trim() || selectedFile || audioBlob) {
      onSendMessage(selectedFile || audioBlob ? undefined : undefined, message.trim());
      setMessage("");
      setSelectedFile(null);
      setAudioBlob(null);
      setPreviewUrl(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "😎", "🤔", "😢", "😡"];

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Media Preview */}
      <AnimatePresence>
        {(selectedFile || audioBlob) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-3 p-3 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedFile && (
                  <>
                    <ImageIcon size={20} className="text-blue-500" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </>
                )}
                {audioBlob && (
                  <>
                    <Mic size={20} className="text-green-500" />
                    <span className="text-sm font-medium">Voice Message</span>
                  </>
                )}
              </div>
              <button
                onClick={cancelMedia}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Indicator */}
      <AnimatePresence>
        {recording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-red-700">
                  Recording... {formatRecordingTime(recordingTime)}
                </span>
              </div>
              <button
                onClick={stopRecording}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <Square size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* File Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <Paperclip size={20} />
        </button>

        {/* Emoji Picker */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <Smile size={20} />
          </button>
          
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10"
              >
                <div className="grid grid-cols-5 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 max-h-32"
            rows={1}
            style={{ minHeight: '44px' }}
          />
          
          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && !selectedFile && !audioBlob)}
            className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Voice Recording */}
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={disabled}
          className={`p-3 rounded-lg transition-colors disabled:opacity-50 ${
            recording 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {recording ? <Pause size={20} /> : <Mic size={20} />}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
        className="hidden"
      />

      {/* Typing Indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-500"
        >
          Customer is typing...
        </motion.div>
      )}
    </div>
  );
};

export default ChatInput;
