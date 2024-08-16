import { findAll } from '../data/database.ts';

/**
 * Fetch products from database
 */

export function fetchProducts(limit?: number) {
  // Example query:
  // SELECT * FROM products WHERE .. JOIN .. ORDER BY .. LIMIT ..;
  return findAll('PRODUCTS', limit);
}

/**
 * Fetch shop from database
 */

export function fetchShop() {
  // Example query
  // SELECT * FROM shop WHERE .. JOIN users ON "shop"."userId" = "users"."id" .. LIMIT 1;
  return {
    id: 1,
    name: 'My Shop',

    shop_owners: [{
      id: 1,
      profile: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        role: 'OWNER'
      }
    }, {
      id: 2,
      profile: {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'STAFF'
      }
    }]
  };
}