import { useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for handling touch interactions
 * Provides utilities for touch events, gesture detection, and mobile-specific interactions
 */
export const useTouch = () => {
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Detect if device supports touch
  const isTouchDevice = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Get touch coordinates
  const getTouchCoordinates = useCallback((event) => {
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    if (!touch) return null;
    
    return {
      x: touch.clientX,
      y: touch.clientY,
      pageX: touch.pageX,
      pageY: touch.pageY,
    };
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event, callback) => {
    const coordinates = getTouchCoordinates(event);
    if (!coordinates) return;

    touchStartRef.current = {
      x: coordinates.x,
      y: coordinates.y,
      timestamp: Date.now(),
    };
    
    isScrollingRef.current = false;
    
    if (callback) {
      callback(event, coordinates);
    }
  }, [getTouchCoordinates]);

  // Handle touch move
  const handleTouchMove = useCallback((event, callback) => {
    const coordinates = getTouchCoordinates(event);
    if (!coordinates || !touchStartRef.current) return;

    const deltaX = Math.abs(coordinates.x - touchStartRef.current.x);
    const deltaY = Math.abs(coordinates.y - touchStartRef.current.y);
    
    // Detect if this is likely a scroll gesture
    if (deltaY > deltaX && deltaY > 10) {
      isScrollingRef.current = true;
    }

    touchMoveRef.current = {
      x: coordinates.x,
      y: coordinates.y,
      deltaX,
      deltaY,
      timestamp: Date.now(),
    };
    
    if (callback) {
      callback(event, coordinates, {
        deltaX,
        deltaY,
        isScrolling: isScrollingRef.current,
      });
    }
  }, [getTouchCoordinates]);

  // Handle touch end
  const handleTouchEnd = useCallback((event, callback) => {
    const coordinates = getTouchCoordinates(event);
    if (!touchStartRef.current) return;

    const endTime = Date.now();
    const duration = endTime - touchStartRef.current.timestamp;
    const deltaX = touchMoveRef.current ? 
      Math.abs(touchMoveRef.current.x - touchStartRef.current.x) : 0;
    const deltaY = touchMoveRef.current ? 
      Math.abs(touchMoveRef.current.y - touchStartRef.current.y) : 0;

    // Determine gesture type
    const isTap = duration < 300 && deltaX < 10 && deltaY < 10;
    const isSwipe = duration < 500 && (deltaX > 50 || deltaY > 50);
    const isLongPress = duration > 500 && deltaX < 10 && deltaY < 10;

    if (callback) {
      callback(event, coordinates, {
        duration,
        deltaX,
        deltaY,
        isTap,
        isSwipe,
        isLongPress,
        isScrolling: isScrollingRef.current,
      });
    }

    // Reset refs
    touchStartRef.current = null;
    touchMoveRef.current = null;
    isScrollingRef.current = false;
  }, [getTouchCoordinates]);

  // Prevent default touch behavior (like zoom, scroll, etc.)
  const preventDefaultTouch = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Create touch event handlers for an element
  const createTouchHandlers = useCallback((callbacks = {}) => {
    return {
      onTouchStart: (event) => handleTouchStart(event, callbacks.onTouchStart),
      onTouchMove: (event) => handleTouchMove(event, callbacks.onTouchMove),
      onTouchEnd: (event) => handleTouchEnd(event, callbacks.onTouchEnd),
      onTouchCancel: (event) => handleTouchEnd(event, callbacks.onTouchCancel),
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Detect swipe direction
  const getSwipeDirection = useCallback((startX, startY, endX, endY) => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  // Prevent iOS bounce scrolling
  const preventBounceScrolling = useCallback(() => {
    const preventDefault = (e) => {
      if (e.touches.length > 1) return;
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventDefault, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  // Handle viewport changes (for mobile keyboard, rotation, etc.)
  const handleViewportChange = useCallback((callback) => {
    let timeout;
    
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (callback) {
          callback({
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: window.orientation || 0,
          });
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // Get device orientation
  const getOrientation = useCallback(() => {
    if (window.orientation !== undefined) {
      return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
    }
    
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }, []);

  // Check if device is in landscape mode
  const isLandscape = useCallback(() => {
    return getOrientation() === 'landscape';
  }, [getOrientation]);

  // Force landscape orientation (show message if not)
  const enforceLandscape = useCallback((showMessage = true) => {
    const orientation = getOrientation();
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && orientation === 'portrait' && showMessage) {
      // The rotation message component will handle this
      return false;
    }
    
    return true;
  }, [getOrientation]);

  return {
    isTouchDevice,
    getTouchCoordinates,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    preventDefaultTouch,
    createTouchHandlers,
    getSwipeDirection,
    preventBounceScrolling,
    handleViewportChange,
    getOrientation,
    isLandscape,
    enforceLandscape,
  };
};

export default useTouch;