import { useMutation } from './apiClient';

/**
 * Compose; saveCanvas API
 */

function composeSaveCanvas(Cmp: any) {
  return function SaveCanvasCmp(p: any) {
    const [uploadFile, { mutating }] = useMutation('upload', {}, true);

    return <Cmp
      {...p}
      uploadFile={uploadFile}
      mutating={mutating}
      notReady
    />;
  }
}

export default composeSaveCanvas;
