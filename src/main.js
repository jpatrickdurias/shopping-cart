const ShoppingCart = require('./ShoppingCart')
const helpers = require('./helpers')

function main() {
  const pricingInfo = helpers.getPricing()

  const cart = new ShoppingCart(pricingInfo)

  // cart.add('ult_small')
  //cart.add('ult_small')
  //cart.add('ult_small')
  // cart.add('ult_small')
  // cart.add('ult_small')
  cart.add('ult_small', 'I<3AMAYSIM')


  //cart.add('ult_medium')
  //cart.add('ult_large')
  //cart.add('1gb')
  //console.log(cart.promoCodes)
  console.log(cart.total())
  console.log(cart.items())
}

main()