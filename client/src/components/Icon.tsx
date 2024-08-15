import {
  Artboard,
  ArrowBackUp,
  ArrowForwardUp,
  Circle,
  CircleFilled,
  Eraser,
  Image,
  Pencil,
  Sticker2,
  TextColor,
  TextResize,
  TextSize,
} from './IconSVGs';

// Full icon map: https://tablericons.com/

const ICON_MAP: {
  [key: string]: React.ReactNode
} = {
  'artboard': Artboard,
  'arrow-back-up': ArrowBackUp,
  'arrow-forward-up': ArrowForwardUp,
  'circle': Circle,
  'circle-filled': CircleFilled,
  'eraser': Eraser,
  'image': Image,
  'pencil': Pencil,
  'sticker-2': Sticker2,
  'text-color': TextColor,
  'text-resize': TextResize,
  'text-size': TextSize,
};

/**
 * Types
 */

type IconPropTypes = {
  name: string;
};

/**
 * Wrapper for Icon components
 */

export function Icon(p: IconPropTypes) {
  const { name: iconName } = p;
  const IconComponent = ICON_MAP[iconName];

  if (!IconComponent) {
    console.warn('Icon: Unknown icon name:', iconName);
  }

  return IconComponent || null;
}