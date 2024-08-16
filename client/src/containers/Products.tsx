'use client';

import { memo } from 'react';
import { composeProducts } from '../platform-agnostic/data-api/ProductsCmp.tsx';
import { Table, TableRow } from '../components/Table.tsx';
import { getFullDate } from '../platform-agnostic/utils/datetime.ts';
import { commaFormat, currencySymbolFormat } from '../platform-agnostic/utils/number.ts';
import i18n from '../platform-agnostic/i18n/index.ts';

/**
 * Types
 */

type ProdutsProps = {
  products?: any[];
  loading: boolean;
};

/**
 * Constants (so memo() doesn't render twice due to data change)
 */

const TABLE_HEADERS = [{
  text: i18n.t('form.name'),
  // className: 'something',
  // iconName: 'something',
  // sort: 'ASC' | 'DESC' | 'NONE' | null
  // etc...
}, {
  text: i18n.t('form.status')
}, {
  text: i18n.t('form.price')
}, {
  text: i18n.t('form.total_sales')
}, {
  text: i18n.t('form.created_at')
}];

/**
 * Product item
 * NOTE: Memoized so it doesn't re-render when a new Array is created by code.
 */

const ProductItem = memo((p: any) => {
  const { name, status, price, totalSales, createdAt } = p;
  return <TableRow
    cols={[{
      text: name,
    }, {
      text: status,
    }, {
      text: currencySymbolFormat(price),
    }, {
      text: commaFormat(totalSales),
    }, {
      text: getFullDate(createdAt),
    }]}
  />;
});

ProductItem.displayName = 'ProductItem';

/**
 * Products table
 */

const ProductsCmp = memo((p: ProdutsProps) => {
  const { products } = p;

  return (
    <Table headers={TABLE_HEADERS} className='m_l_t'>
      {products?.map((product: any) => (
        <ProductItem
          key={product.id}
          {...product}
        />
      ))}
    </Table>
  );
});

ProductsCmp.displayName = 'GenerateReport';

export const Products = composeProducts(ProductsCmp);