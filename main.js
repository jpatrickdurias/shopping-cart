const ShoppingCart = require('./ShoppingCart')
const fs = require('fs')

function main() {
  const jsonFile = fs.readFileSync("./ItemPrices.json")
  const pricingInfo = JSON.parse(jsonFile)

  cart = new ShoppingCart(pricingInfo)

  cart.add('ult_small')
  cart.add('ult_small')
  cart.add('ult_small')
  cart.add('ult_small')
  cart.add('ult_small')
  cart.add('ult_small')


  cart.add('ult_medium')
  cart.add('ult_large')
  cart.add('1gb')
  console.log(cart.total())
  console.log(cart.items())
}

main()