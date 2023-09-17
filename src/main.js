const ShoppingCart = require('./ShoppingCart');
const helpers = require('./helpers');

/**
 * main() - main entry point
 */
function main() {
  const pricingInfo = helpers.getPricing();

  const cart = new ShoppingCart(pricingInfo);

  cart.add('ult_small');
  cart.add('ult_small');
  cart.add('ult_large');
  cart.add('ult_large');
  cart.add('ult_large');
  cart.add('ult_large');

  console.log('Total amount: %d', cart.total());
  console.log('Cart Items: %o', cart.items());
};

main();
