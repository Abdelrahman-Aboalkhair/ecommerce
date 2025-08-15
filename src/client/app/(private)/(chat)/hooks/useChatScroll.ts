import { useEffect, useRef, useCallback } from 'react';

interface UseChatScrollProps {
  messages: any[];
  autoScroll?: boolean;
}

export const useChatScroll = ({ messages, autoScroll = true }: UseChatScrollProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 100; // pixels from bottom
    isNearBottom.current = scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && isNearBottom.current) {
      scrollToBottom();
    }
  }, [messages, autoScroll, scrollToBottom]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return {
    messagesEndRef,
    containerRef,
    scrollToBottom,
    scrollToTop,
    isNearBottom: isNearBottom.current,
  };
};
