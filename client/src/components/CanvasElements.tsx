import { memo } from 'react';
import { Icon } from './Icon';
import { cn } from '../ck/utils/string';

/**
 * Types
 */

export type ToolType = 'PEN' | 'ERASER' | 'TEXT' | 'IMAGE';
export type ActionType = 'UNDO' | 'CLEAR_ALL' | 'REDO';
export type ControlType = 'BREAK' | 'COLOR_SWATCH' | 'TEXT_COLOR' | 'TEXT_SIZE' | 'BUTTON';

type ControlOptionType = Partial<{
  namespace: string;
  type: ToolType & ControlType & ActionType;
  text: string;
  iconName: string;
  className: string;
}>;

export type CanvasControlsState = Partial<{
  selectedTool: ToolType;
  action: ActionType;
  counter: number;
}>;

type CanvasControlsProps = {
  options: Array<ControlOptionType | Array<ControlOptionType>>;
  controls: CanvasControlsState;
  onClickItem: (type: string, value?: any) => void;
};

type CanvasItemProps = {
  grouped?: boolean;
  selected?: boolean;
  option: ControlOptionType;
  currentValue?: boolean | string | number;
  onClick: (namespace: string | undefined, type: string, value?: any) => void;
};

/**
 * Default presets
 */

const CANVAS_ITEM: {
  [key: string]: ControlOptionType;
} = {
  CLEAR_ALL: {
    namespace: 'action',
    iconName: 'sticker-2',
  },
  COLOR_SWATCH: {
    namespace: 'selectedTool',
    iconName: 'circle',
  },
  ERASER: {
    namespace: 'selectedTool',
    iconName: 'eraser',
  },
  IMAGE: {
    namespace: 'selectedTool',
    iconName: 'image',
  },
  PEN: {
    namespace: 'selectedTool',
    iconName: 'pencil',
  },
  REDO: {
    namespace: 'action',
    iconName: 'arrow-forward-up'
  },
  TEXT: {
    namespace: 'selectedTool',
    iconName: 'text-resize'
  },
  TEXT_COLOR: {
    iconName: 'text-color',
  },
  TEXT_SIZE: {
    iconName: 'text-size',
  },
  UNDO: {
    namespace: 'action',
    iconName: 'arrow-back-up',
  }
};

/**
 * Helper; check if selected
 */

function isControlSelected(type: ToolType & ControlType & ActionType, controls: CanvasControlsState) {
  const defaults = CANVAS_ITEM[type];
  if (defaults) {
    const ns = defaults.namespace;
    return controls[ns] === type;
  }
  return false;
}

/**
 * Canvas item
 */

const CanvasItem = memo((p: CanvasItemProps) => {
  const { grouped, option, selected, onClick } = p;
  const { namespace, type, iconName, className, value, text } = { ...CANVAS_ITEM[option.type], ...option };

  return (
    <button
      className={cn(
        'cv_item h_center ft_s btn',
        className,
        selected ? 'bg_primary' : '',
        value ? 'link' : '', grouped ? 'ic_s' : 'ic_d', type
      )}
      onClick={() => onClick(namespace, type, value)}
    >
      {iconName ? <Icon name={iconName} /> : null}
      {text}
    </button>
  );
});

CanvasItem.displayName = 'CanvasItem';

/**
 * Canvas controls
 */

export const CanvasControls = memo((p: CanvasControlsProps) => {
  const { controls, onClickItem, options } = p;

  return (
    <nav className='cv_ctrl h_item'>
      {options.map((opt: ControlOptionType, i: number) => {
        if (Array.isArray(opt)) {
          return (
            <div className='cv_ctrl_grp h_item' key={`group-${i}`}>
              {opt.map((so: ControlOptionType) => (
                <CanvasItem
                  key={so.type}
                  grouped
                  option={so}
                  currentValue={controls[so.type]}
                  onClick={onClickItem}
                />
              ))}
            </div>
          );
        }

        return (
          <CanvasItem
            key={opt.type}
            option={opt}
            selected={isControlSelected(opt.type, controls)}
            currentValue={controls[opt.type]}
            onClick={onClickItem}
          />
        );
      })}
    </nav>
  );
});

CanvasControls.displayName = 'CanvasControls';
