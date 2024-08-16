import { memo } from 'react';
import { cn } from '../platform-agnostic/utils/string.ts';

/**
 * Types
 */

type TableColProps = {
  text: string;
  className?: string;
  // iconName?: string;
  // etc
};

type TableRowProps = {
  cols: TableColProps[];
  className?: string;
};

type TableProps = {
  headers: TableColProps[];
  className?: string;
  children: React.ReactNode;
};

/**
 * Table column
 */

const TableCol = memo((p: TableColProps) => {
  const { text, className } = p;

  return <td className={cn('tcol p_s', className)}>
    {text}
  </td>;
});

TableCol.displayName = 'TableCol';

/**
 * Table header column
 */

const TableHeaderCol = memo((p: TableColProps) => {
  const { text, className } = p;

  return <td className={cn('th p_s', className)}>
    <strong>
      {text}
    </strong>
  </td>;
});

TableHeaderCol.displayName = 'TableHeaderCol';

/**
 * Table
 */

export const Table = memo((p: TableProps) => {
  const { headers, className, children } = p;

  return (
    <table className={cn('table bg_alt', className)}>
      <thead className='trow thead bg'>
        <tr>
          {headers.map((header, i) => (
            <TableHeaderCol
              key={i}
              {...header}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  );
});

Table.displayName = 'Table';


export const TableRow = memo((p: TableRowProps) => {
  const { cols, className } = p;

  return <tr className={cn('trow', className)}>
    {cols.map((col, i) => (
      <TableCol
        key={i}
        {...col}
      />
    ))}
  </tr>;
});

TableRow.displayName = 'TableRow';