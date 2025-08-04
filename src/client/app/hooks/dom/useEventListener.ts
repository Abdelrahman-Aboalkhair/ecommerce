"use client";
import { useEffect, useRef } from "react";

function useEventListener<K extends keyof WindowEventMap>(
  eventType: K,
  callback: (event: WindowEventMap[K]) => void,
  element?: HTMLElement | Window | Document
) {
  // * Store the callback in a ref to avoid creating a new function on every render
  const callbackRef = useRef(callback);

  // * Update the ref's value if the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // * Attach the event listener
  useEffect(() => {
    // If no element is provided, use `window` dynamically inside the client
    const targetElement = element ?? window;

    if (!targetElement) return;

    const eventListener = (event: Event) =>
      callbackRef.current(event as WindowEventMap[K]);

    targetElement.addEventListener(eventType, eventListener);
    return () => targetElement.removeEventListener(eventType, eventListener);
  }, [eventType, element]);
}

export default useEventListener;

/**
 * EXAMPLE USAGE
 *
 * const handleScroll = () => {
  console.log("Scrolling...");
 }

 * useEventListener("scroll", handleScroll);
 *
 */
