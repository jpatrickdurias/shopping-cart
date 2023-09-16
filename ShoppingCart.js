const fs = require('fs')

module.exports = class ShoppingCart {
  constructor(pricingInfo) {
    this.pricingInfo = pricingInfo
    this.cart = [] // actual final cart at checkout
    this.order = []
    this.freebies = []
    this.promo_code = []
    this.total_amount = 0
    this.discount = 0

    const jsonFile = fs.readFileSync("./Promos.json")
    this.promos = JSON.parse(jsonFile)
  }

  total() {
    this.calcTotal()
    this.calcDiscounts()
    return this.total_amount - this.discount
  }

  calcTotal() {
    console.log(this.order)
    this.total_amount = 0

    this.order.map(item => {
      const price = this.pricingInfo[item.itemCode].price

      this.total_amount += price * item.quantity
    })
  }

  add(itemCode, promoCode) {
    if (!(itemCode in this.pricingInfo)) return false

    if (!(promoCode) in this.promoCode) this.promo_code.push(promoCode)

    const itemIndex = this.order.findIndex((item) => item.itemCode === itemCode)

    if (itemIndex !== -1) {
      this.order[itemIndex].quantity += 1
    } else {
      this.order.push({
        itemCode: itemCode,
        quantity: 1
      })
    }

    return true
  }

  calcFreebies() {
    this.promos.map((promo) => {
      if (promo.promo_type === 'freebie') {
        const item = this.order.find((item) => item.itemCode === promo.item)

        const freebie_count = Math.floor(item.quantity/promo.minimum_quantity)

        const itemIndex = this.freebies.findIndex((item) => item.itemCode === itemCode)

        if (itemIndex !== -1) {
          this.freebies[itemIndex].quantity += freebie_count
        } else {
          this.freebies.push({
            itemCode: promo.free_item,
            quantity: freebie_count
          })
        }
      }
    })
  }

  calcDiscounts() {
    this.discount = 0

    this.promos.map((promo) => {
      if (promo.promo_type === 'discount_bulk') {
        const item = this.order.find((item) => item.itemCode === promo.item)

        const discount_count = Math.floor(item.quantity/promo.minimum_quantity)

        if ('flat_off_order' in promo) {
          this.discount += discount_count * promo.flat_off_order
        } else if ('percent_off_order' in promo) {
          this.discount += (discount_count * promo.percent_off_order * this.total_amount)/100
        }
      } else if (promo.promo_type === 'discount_per_item') {
        const item = this.order.find((item) => item.itemCode === promo.item)

        if (item.quantity > promo.minimum_quantity) {
          if ('flat_off_item' in promo) {
            this.discount += item.quantity * promo.flat_off_item
          } else if ('percent_off_item' in promo) {
            this.discount += (item.quantity * promo.percent_off_item * this.pricingInfo[item.itemCode])/ 100
          }
        }
      } else if (promo.promo_type === 'discount_order') {
        if (promo.promo_code in this.promoCode) {
          this.discount += promo.percent_off_order * this.total_amount
        }
      }
    })
  }



  generateFinalCart() {
    this.calcFreebies()

    this.cart = [...this.order]

    this.freebies.map((free_item) => {
      const cart_item_index= this.order.findIndex((item) => item.itemCode === free_item.itemCode)

      if (cart_item_index !== -1) {
        this.cart[cart_item_index].quantity += free_item.quantity
      } else {
        this.cart.push({
          itemCode: free_item.itemCode,
          quantity: freebie_count
        })
      }
    })
  }

  items() {
    this.generateFinalCart()
    return this.cart
  }

  promoCode() {
    return this.promo_code
  }

}
