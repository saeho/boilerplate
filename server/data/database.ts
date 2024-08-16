import { uniq, orderBy, randomItem } from '../utils/object.ts';

let PRODUCTS_TABLE: Set<any>;

/**
 * Database schema design;
 * just in case you want to see how I'd design the database
 */

// 1. User tables and relationships

// Table: [users]
// id: int primary key
// activated: boolean
// createdAt: Date
// updatedAt: Date

// Table: [user_profiles]
// id: int primary key
// userId: int foreign key to users.id
// firstName: string
// lastName: string
// createdAt: Date
// updatedAt: Date

// Other relationships here such as...
// [user_emails] [user_phone] [user_address] [user_oauth_google] [user_oauth_amazon] etc ...

// 2. Shop tables and relationships

// Table: [shops]
// id: int primary key
// name: string
// createdAt: Date
// updatedAt: Date

// Table: [shop_owners]
// id: int primary key
// userId: int foreign key to users.id
// shopId: int foreign key to shops.id
// role: enum ['OWNER','ADMIN','STAFF','ACCOUNTANT']
// createdAt: Date
// updatedAt: Date

// 3. Product tables and relationships

// Table: [products]
// id: int primary key
// createdById: int foreign key to users.id
// shopId: int foreign key to shops.id
// name: string
// status: enum ['ACTIVE','DRAFT','ARCHIVED']
// price: float
// createdAt: Date
// updatedAt: Date

// Table: [product_sales] (one to many relationship)
// id: int primary key
// productId: int foreign key to products.id
// customerId: int foreign key to users.id
// quantity: int
// salePrice: float (customer could have bought at a discount)
// createdAt: Date
// updatedAt: Date

// Other relationships here such as...
// [stripe_transactions] [product_reviews] [product_categories] etc ...

// 4. Report tables and relationships

// Table: [reports]
// id: int primary key
// shopId: int foreign key to shops.id
// beginDate: Date
// endDate: Date

/**
 * Mock database with data
 */

export function mockDatabase() {
  const words = [
    ['Smartphone','Tablet','Laptop','Desktop','Server','Monitor','Keyboard','Mouse','Headphones','Printer','Scanner','Projector','Camera','Smartwatch','Fitness tracker','Drone','Gaming console','VR headset','Router','Home device','Smart speaker','Smart display','Smart light','Smart plug','Thermostat', 'Electronics lock', 'Security camera', 'Vision doorbell', 'Smart alarm', 'Future sensor', 'Double switch', 'Garage door opener', 'Irrigation controller', 'Smoke detector'],
    ['X','Y','Z','Eco-Friendly','"Cat"','"Code Red"','HD','XHD','Plasma','LED','"Next Level"','King','Queen','Prince','Princess','Family-Friendly','4K','8K','AI',''],
    ['A1000','Pro','Plus','Lite','Max','Ultra','Elite','Extreme','Xpress','A2000','A3000','A4000','B500','B600','B700','B800','C90','D10','D20','C91','C92','C93','C94','Rare','']
  ];

  // Create a list of up to 5000 unique products
  // (Duplicates will be omitted so it will be less than 10,000)

  const products = uniq([...Array(5000)].map(() => {
    return words.map(wArr => randomItem(wArr)).filter(Boolean).join(' ');
  }));

  const dbEntries = products.map((name, i) => {
    // Create a random date between now to 30 days ago
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    return {
      id: i + 1,
      name,
      status: randomItem(['ACTIVE','DRAFT','ARCHIVED']),
      price: Math.floor(Math.random() * 2000),
      totalSales: Math.floor(Math.random() * 1000),
      createdAt,
      updatedAt: createdAt
    };
  });

  PRODUCTS_TABLE = new Set(dbEntries);

  // const arr = Array.from(PRODUCTS_TABLE);
  // console.log(dbEntries[0]);
  // console.log(arr[0]);
  // console.log(PRODUCTS_TABLE.size);
}

/**
 * Fetch from database
 */

export function findAll(query: 'PRODUCTS', limit?: number) {
  if (!PRODUCTS_TABLE) {
    mockDatabase();
  }

  switch (query) {
    case 'PRODUCTS': {
      const produtsArr = Array.from(PRODUCTS_TABLE);
      return orderBy(limit ? produtsArr.slice(0, limit) : produtsArr, 'createdAt', 'desc');
    } default:
  }
  return [];
}
