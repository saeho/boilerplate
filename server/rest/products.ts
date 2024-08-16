import { fetchProducts, fetchShop } from '../libs/productLib.ts';
import { getFullDate } from '../utils/datetime.ts';
import { currencySymbolFormat } from '../utils/number.ts';
import GD from '../data/google-docs.ts';

/**
 * Types
 */

/**
 * List products in memory database
 */

export function listProducts() {
  const products = fetchProducts(1000);
  return products;
}

/**
 * Create paragraphs
 */

function makeShopSection(shop: any): any[] {
  const owner = shop.shop_owners.find((user: any) => user.profile.role === 'OWNER');

  return [
    ['Shop\n', ['heading2']],
    ['ID: ', ['text','bold']], [btoa(shop.id) + '\n'],
    ['Name: ', ['text','bold']], [shop.name + '\n'],
    ['Owner: ', ['text','bold']], [owner.profile.firstName + ' ' + owner.profile.lastName + '\n'],
  ];
}

/**
 * Make sales summary
 */

function makeSalesSummary(products: any[]): any[] {

  const totalSales = products.reduce((acc, product) => acc + (product.totalSales * product.price), 0);
  const averageSale = totalSales / products.length;
  const sortedBySale = products.sort((a, b) => (b.totalSales * b.price) - (a.totalSales * a.price));
  const bestPerforming = sortedBySale[0];
  const worstPerforming = sortedBySale[sortedBySale.length - 1];

  return [
    ['Sales\n', ['heading2']],
    ['Total sales: ', ['text','bold']], [currencySymbolFormat(totalSales) + '\n'],
    ['Average sale: ', ['text','bold']], [currencySymbolFormat(averageSale) + '\n'],
    ['Best performing: ', ['text','bold']], [
      bestPerforming.name +
      ` (${currencySymbolFormat(bestPerforming.totalSales * bestPerforming.price)} total sale; ` +
      `${currencySymbolFormat(bestPerforming.price)}) per unit; ` +
      `${currencySymbolFormat(bestPerforming.totalSales)}) sold)\n`
    ],
    ['Worst performing: ', ['text','bold']], [
      worstPerforming.name +
      ` (${currencySymbolFormat(worstPerforming.totalSales * worstPerforming.price)} total sale; ` +
      `${currencySymbolFormat(worstPerforming.price)}) per unit; ` +
      `${currencySymbolFormat(worstPerforming.totalSales)}) sold)\n`
    ],
  ];
}

/**
 * Create AI summary
 */

function makeAISummary(shop: any): any[] {

  // NOTE:
  // I have a lot of experience with various AI models including:
  // Mixtral, Mistral, LLAMA2, LLAMA3, Open AI, and few fine-tuned models.

  // They all have slightly different prompt formatting structure that they work better with.
  // It all depends on which format the model was trained on.
  // I chose "###" for the format word, which is the Alpaca format and one of the common ones used.
  // But there are other formats like "<|im_start|>" for LLAMA3, etc.

  // If we're using Open AI however, this wouldn't matter that much. Especially at higher quantization.

  // const prompt = (
  //   '### Instruction:\n' +
  //   'You are an assistant to the CEO of {{SHOP_NAME}}. Your task is to create a executive ' +
  //   'summary report for the month of {{MONTH}}. The report should include a summary of the ' +
  //   'sales data with informations about the top and worst performing products. Given the ' +
  //   'previous historical sales data and additional information, provide recommendations and a ' +
  //   'forecast for the upcoming months.\n\n' +

  //   '### Historical sales data:\n' +
  //   '{{HISTORICAL_SALES_DATA}}\n\n' +

  //   '### Additional information:\n' +
  //   '{{ADDITIONAL_INFORMATION}}\n\n' +

  //   '### Output:\n'
  // );

  // const stop = [
  //   '###',
  // ];

  // const hyperParams = {
  //   temperature: 0.66,
  //   top_p: 0.54,
  //   typical_p: 0.19,
  //   repetition_penalty: 1.23,
  //   repetition_penalty_range: 2048,
  //   top_k: 50,
  //   min_p: 0.05
  // };

  return [
    ['AI Summary\n', ['heading2']],
    [
      'Revenues were strong for the month of August. My Shop saw a 24.5% increase ' +
      'in sales compared to the previous month. The top selling product was "Headphones Lite" ' +
      'which sold 4,194 units. The most profitable product was Future sensor Z Pro with ' +
      'a total profit of $23,589.00 and 20 products had less than 10 sales total.\n\n' +

      'Based on the sales trends and historical data, we believe sales will continue to rise ' +
      'into the holiday season ahead. We recommend increasing the marketing budget to prepare ' +
      'for the holiday season and adjusting the inventory properly.'
    ],
  ];
}

/**
 * Create a product report
 */

export async function createProductReport() {

  const today = new Date();
  const beginningOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const title = `Executive summary: ${getFullDate(beginningOfMonth)}`;
  const products = fetchProducts();
  const shop = fetchShop();

  const documentContent = [
    [
      ['Executive Summary', ['text','heading1']]
    ],
    makeShopSection(shop),
    makeSalesSummary(products),
    makeAISummary(shop),
  ];

  // const testId = '1ALDUv8QW4Y6FLJz7TJyJBxzT3DOQiTvIcuVO_C6WIgs';
  // await GD.updatePermissions(testId, 'anyone', 'writer');
  // await GD.updatePermissions(testId, 'anyone', 'reader');
  // await GD.batchUpdateDocument(testId, documentContent);
  // return testId;

  const createdId = await GD.createDocument(
    title,
    documentContent
  );

  return createdId;
}
