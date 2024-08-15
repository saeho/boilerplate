import { useContext } from 'react';
import { useMutation } from './apiClient';
import appContext from '../data-context/appContext';

/**
 * Compose; saveCanvas API
 */

function composeSaveCanvas(Cmp: any) {
  return function SaveCanvasCmp(p: any) {
    const { appState: { canvasSession } } = useContext(appContext);
    const [saveCanvas, { mutating }] = useMutation('canvas');

    return <Cmp
      {...p}
      canvasSession={canvasSession}
      saveCanvas={saveCanvas}
      mutating={mutating}
      notReady
    />;
  }
}

export default composeSaveCanvas;
