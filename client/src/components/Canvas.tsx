import { useRef, useEffect, memo } from 'react';
import type { CanvasControlsState, ToolType, ActionType } from './CanvasElements';
import './Canvas.css';

/**
 * Types
 */

type CanvasProps = {
  domId?: string;
  controls: CanvasControlsState;
  saving?: boolean;
  lastCanvasData?: string;
  onAutoSave?: (canvasData: any) => void;
};

type XYPoint = {
  x: number;
  y: number;
};

type TrackerRefType = {
  saving: boolean;
  drawing: boolean;
  selectedTool: ToolType;
  history: Array<XYPoint[]>;
  points: XYPoint[];
  lastCanvasData?: string;
};

/**
 * Helper; Get Canvas Context
 */

function getCanvasContext(cv: HTMLCanvasElement, lastCanvasData?: string) {
  const ctx = cv.getContext('2d');
  const ratio = Math.ceil(window.devicePixelRatio);
  const width = window.innerWidth;
  const height = window.innerHeight

  // Resize the image (for retina screens)
  ctx.canvas.width  = width * ratio;
  ctx.canvas.height = height * ratio;
  ctx.canvas.style.width = `${width}px`;
  ctx.canvas.style.height = `${height}px`;
  ctx.canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);

  // Set line width after retina scaling
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (lastCanvasData) {
    const img = new Image();
    img.onload = function() {
      // Resize the image (for retina screens)
      const imgWidth = img.width / ratio;
      const imgHeight = img.height / ratio;
      const canvasWidth = ctx.canvas.width / ratio;
      const canvasHeight = ctx.canvas.height / ratio;
      const widthScale = canvasWidth / imgWidth;
      const heightScale = canvasHeight / imgHeight;
      const scale = Math.min(widthScale, heightScale);
      const newWidth = imgWidth * scale;
      const newHeight = imgHeight * scale;

      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);
    };
    img.src = lastCanvasData;
  }

  return ctx;
}

/**
 * Save, if conditions are met
 */

function saveIfNeeded(cv: HTMLCanvasElement | null, tracker: any, onAutoSave: Function) {
  if (cv) {
    const base64Str = cv.toDataURL();
    if (!tracker.saving && base64Str !== tracker.lastCanvasData) {
      tracker.lastCanvasData = base64Str;
      onAutoSave(tracker.lastCanvasData);
    }
  }
}

/**
 * Find mid point between two points
 */

function findMidPoint(p1: XYPoint, p2: XYPoint) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

/**
 * Check if a point overlaps between two points
 */

function isOverlapping(from: XYPoint, to: XYPoint, clickPoint: XYPoint, strokeWidth: number) {
  const minX = Math.min(from.x, to.x) - strokeWidth / 2;
  const maxX = Math.max(from.x, to.x) + strokeWidth / 2;
  const minY = Math.min(from.y, to.y) - strokeWidth / 2;
  const maxY = Math.max(from.y, to.y) + strokeWidth / 2;

  return clickPoint.x >= minX && clickPoint.x <= maxX && clickPoint.y >= minY && clickPoint.y <= maxY;
}

/**
 * Erase the first point that overlaps with the given point
 */

function eraseLineOnPoint(tracker: TrackerRefType, clickPoint: XYPoint) {
  const { history } = tracker;
  const hLen = history.length;

  for (let ii = 0; ii < hLen; ii++) {
    const hPoints = history[ii];
    const pLen = hPoints.length;

    for (let i = 0; i < pLen; i++) {
      const point = hPoints[i];
      const nextPoint = hPoints[i + 1];

      if (point && nextPoint && isOverlapping(point, nextPoint, clickPoint, 50)) {
        // tracker.history[ii] = tracker.history[ii].slice(0, i).concat(tracker.history[ii].slice(i + 1));
        const before = tracker.history[ii].slice(0, i);
        const after = tracker.history[ii].slice(i + 1);

        if (before.length >= 2) {
          tracker.history[ii] = before;

          if (after.length >= 2) {
            tracker.history.splice(ii + 1, 0, after);
          }
        } else if (after.length >= 2) {
          tracker.history[ii] = after;
        } else {
          tracker.history.splice(ii, 1);
        }

        return;
      }
    }
  }
}

/**
 * Redraw a set of points
 */

function redrawPoints(ctx: CanvasRenderingContext2D, points: XYPoint[]) {
  let [p1, p2] = points;
  if (p1 && p2) {

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    for (let i = 1, len = points.length; i < len; i++) {
      // we pick the point between pi+1 & pi+2 as the
      // end point and p1 as our control point
      const midPoint = findMidPoint(p1, p2);
      ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i+1];
    }

    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
}

/**
 * Helper; redraw <canvas>
 */

function redrawLines(ctx: CanvasRenderingContext2D, tracker: TrackerRefType) {

  const { history, points } = tracker;

  // Erase canvas before redrawing
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const prevPoints of history) {
    redrawPoints(ctx, prevPoints);
  }

  redrawPoints(ctx, points);
}

/**
 * Use Canvas hooks
 */

const useCanvas = (p: CanvasProps) => {
  const { saving, controls, lastCanvasData, onAutoSave } = p;

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const trackerRef = useRef<TrackerRefType>({
    lastCanvasData,
    selectedTool: controls.selectedTool as ToolType,
    history: [],
    points: [],
    drawing: false,
    saving: !!saving
  });

  // Keep track of saving status so it can be used in memoized hooks

  useEffect(() => {
    trackerRef.current.saving = !!saving;
  }, [saving]);

  // Keep track of selected tool

  useEffect(() => {
    trackerRef.current.selectedTool = controls.selectedTool as ToolType;
  }, [controls]);

  useEffect(() => {
    switch (controls.action) {
      case 'CLEAR_ALL':
        ctxRef.current = getCanvasContext(cvRef.current);
        trackerRef.current.history = [];
        break;
      default:
        if (controls.action) {
          console.log('ACTION:', controls.action);
        }
    }
  }, [controls.counter]);

  useEffect(() => {
    if (cvRef.current) {
      ctxRef.current = getCanvasContext(cvRef.current, trackerRef.current.lastCanvasData);

      let saveInterval: NodeJS.Timeout | undefined;

      const applySelectedTool = (e: MouseEvent) => {
        if (trackerRef.current.drawing && cvRef.current && ctxRef.current && e.isTrusted) {

          switch (trackerRef.current.selectedTool) {
            case 'PEN':
              trackerRef.current.points.push({ x: e.clientX, y: e.clientY });
              break;
            case 'ERASER':
              const clickPoint = { x: e.clientX, y: e.clientY };
              eraseLineOnPoint(trackerRef.current, clickPoint);
              break;
            default:
          }

          redrawLines(ctxRef.current, trackerRef.current);
        }
      };

      const onMouseDown = (e: MouseEvent) => {
        if (e.isTrusted && ctxRef.current) {
          trackerRef.current.drawing = true;
          applySelectedTool(e);

          if (onAutoSave) {
            clearInterval(saveInterval);
            saveInterval = setInterval(() => {
              saveIfNeeded(cvRef.current, trackerRef.current, onAutoSave);
            }, 2500);
          }
        }
      };

      const onMouseStop = (e: MouseEvent) => {
        if (ctxRef.current && e.isTrusted) {
          trackerRef.current.drawing = false;
          trackerRef.current.history.unshift(trackerRef.current.points.slice(0));
          trackerRef.current.points = [];

          if (onAutoSave) {
            // NOTE: setTimeout() will be cleared by clearInterval() too
            clearInterval(saveInterval);
            saveInterval = setTimeout(() => {
              saveIfNeeded(cvRef.current, trackerRef.current, onAutoSave);
            }, 2500);
          }
        }
      };

      const listeners = [
        // Touch events for mobile
        ['touchstart', onMouseDown],
        ['touchmove', applySelectedTool],
        ['touchend', onMouseStop],
        // Mouse events for desktop
        ['mousedown', onMouseDown],
        ['mousemove', applySelectedTool],
        ['mouseup', onMouseStop],
        ['mouseout', onMouseStop]
      ];

      for (const [eventName, listenerFn] of listeners) {
        cvRef.current.addEventListener(eventName, listenerFn);
      }

      return () => {
        for (const [eventName, listenerFn] of listeners) {
          if (cvRef.current) {
            cvRef.current.removeEventListener(eventName, listenerFn);
          }
        }

        clearInterval(saveInterval);
        if (onAutoSave) {
          saveIfNeeded(cvRef.current, trackerRef.current, onAutoSave);
        }
      };
    }
  }, []);

  return [cvRef];
};

/**
 * HTML Canvas
 */

const Canvas = memo((p: CanvasProps) => {
  const { domId } = p;
  const [cvRef] = useCanvas(p);

  return (
    <canvas
      ref={cvRef}
      id={domId}
      className='page_ht ck_canvas'
    />
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
