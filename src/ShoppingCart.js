const helpers = require('./helpers')

module.exports = class ShoppingCart {
  constructor(pricingInfo) {
    this.pricingInfo = pricingInfo
    this.cart = [] // actual final cart at checkout
    this.order = []
    this.freebies = []
    this.input_promo_codes = []

    this.total_amount = 0
    this.discount = 0

    this.available_promos = helpers.getPromos();
    this.available_promo_codes = this.available_promos.map((promo) => {
      return promo.promo_code
    }).filter((code) => { return code })
  }

  total() {
    this.#calcTotal()
    this.#calcDiscounts()
    return this.total_amount - this.discount
  }

  add(inputItemCode, inputPromoCode) {
    if (!(inputItemCode in this.pricingInfo)) return false

    if (this.available_promo_codes.includes(inputPromoCode) &&
      !(this.input_promo_codes.includes(inputPromoCode))) {
      this.input_promo_codes.push(inputPromoCode)
    }

    const itemIndex = this.order.findIndex((item) => item.itemCode === inputItemCode)

    if (itemIndex !== -1) {
      this.order[itemIndex].quantity += 1
    } else {
      this.order.push({
        itemCode: inputItemCode,
        quantity: 1
      })
    }

    return true
  }

  items() {
    this.#generateFinalCart()
    return this.cart
  }

  promoCodes() {
    return this.input_promo_codes
  }

  #calcTotal() {
    this.total_amount = 0

    this.order.map(item => {
      const price = this.pricingInfo[item.itemCode].price 

      this.total_amount += price * item.quantity
    })
  }

  #calcFreebies() {
    this.available_promos.map((promo) => {
      if (promo.promo_type === 'freebie') {
        const item = this.order.find((item) => item.itemCode === promo.item)

        if (!item) return

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

  #calcDiscounts() {
    this.discount = 0

    this.available_promos.map((promo) => {
      if (promo.promo_type === 'discount_bulk') {
        const item = this.order.find((item) => item.itemCode === promo.item)

        if (!item) return

        const discount_count = Math.floor(item.quantity/promo.minimum_quantity)

        if ('flat_off_order' in promo) {
          this.discount += discount_count * promo.flat_off_order
        } else if ('percent_off_order' in promo) {
          this.discount += (discount_count * promo.percent_off_order * this.total_amount)/100
        }
      } else if (promo.promo_type === 'discount_per_item') {
        const item = this.order.find((item) => item.itemCode === promo.item)

        if (!item) return

        if (item.quantity > promo.minimum_quantity) {
          if ('flat_off_item' in promo) {
            this.discount += item.quantity * promo.flat_off_item
          } else if ('percent_off_item' in promo) {
            this.discount += (item.quantity * promo.percent_off_item * this.pricingInfo[item.itemCode])/ 100
          }
        }
      } else if (promo.promo_type === 'discount_order') {
        if (this.input_promo_codes.includes(promo.promo_code)) {
          this.discount += (promo.percent_off_order * this.total_amount)/100
        }
      }
    })
  }

  #generateFinalCart() {
    this.#calcFreebies()

    this.cart = [...this.order]

    this.freebies.map((free_item) => {
      const cart_item_index= this.order.findIndex((item) => item.itemCode === free_item.itemCode)

      if (cart_item_index !== -1) {
        this.cart[cart_item_index].quantity += free_item.quantity
      } else {
        this.cart.push({
          itemCode: free_item.itemCode,
          quantity: free_item.quantity
        })
      }
    })
  }


}
