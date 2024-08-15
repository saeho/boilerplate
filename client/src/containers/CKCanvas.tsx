'use client';

import { useState, useEffect } from 'react';
import Canvas from '../components/Canvas';
import { CanvasControls, type CanvasControlsState } from '../components/CanvasElements';
import { type CanvasSessionType } from '../typescript/apiResultTypes';
import composeSaveCanvas from '../ck/data-api/CanvasCmp';
import i18n from '../ck/i18n/index';

/**
 * Types
 */

type CKCanvasProps = {
  saving: boolean;
  canvasSession: CanvasSessionType;
  saveCanvas: (params: any) => void;
};

/**
 * Constants
 */

const CANVAS_CONTROL_OPTS = [{
  type: 'PEN',
}, {
  type: 'ERASER',
}, {
  type: 'TEXT',
}, {
  type: 'IMAGE',
},
  [{
    type: 'COLOR_SWATCH',
  }, {
    type: 'TEXT_COLOR',
  }, {
    type: 'TEXT_SIZE',
  }],
  [{
    type: 'UNDO',
  }, {
    type: 'CLEAR_ALL',
  }, {
    type: 'REDO',
  }],
{
  type: 'BUTTON',
  className: 'bg_primary',
  text: i18n.t('form.publish')
}];

/**
 * ClassKick Canvas
 */

function CKCanvas(p: CKCanvasProps) {

  const { saving, saveCanvas, canvasSession } = p;
  const [canvasControls, setCanvasControls] = useState<CanvasControlsState>({
    selectedTool: 'PEN',
  });

  const onClickControlItem = (namespace: string, type: string, value?: any) => {
    const nextValue = value || type;
    setCanvasControls({
      ...canvasControls,
      [namespace]: nextValue,
      counter: (canvasControls.counter || 0) + (namespace === 'action' ? 1 : 0),
    });
  };

  const onAutoSave = (canvasData: string) => {
    saveCanvas({ canvasData });
  };

  useEffect(() => {
    const beforeBodyClassName = document.body.className;
    // Disable scroll when page mounts
    // This will allow canvas to be full screen without the minor "shifting" effect which is a visual bug
    document.body.className = 'of scroll_lock';

    return () => {
      // Reset the body class back to what it was before
      document.body.className = beforeBodyClassName;
    };
  }, []);

  return <>
    <CanvasControls
      options={CANVAS_CONTROL_OPTS}
      controls={canvasControls}
      onClickItem={onClickControlItem}
    />
    <Canvas
      lastCanvasData={canvasSession.canvasData}
      controls={canvasControls}
      saving={saving}
      onAutoSave={onAutoSave}
    />
  </>;
}

export default composeSaveCanvas(CKCanvas);
