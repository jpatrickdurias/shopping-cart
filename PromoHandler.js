module.exports = class PromoHandler {
  constructor(ShoppingCart) {
    this.cart = ShoppingCart.items()
    this.appliedPromoCode = ShoppingCart.promoCode()

    jsonFile = fs.readFileSync("./Promos.json")
    this.promos = JSON.parse(jsonFile)
  }

  apply() {
    this.promos.map((promo) => {
      if (promo_code in promo && promo.code === this.appliedPromoCode) {
        applyPromo(promo);
      }
      // discount bulk = (order - flat_off * quantity // minimum_quantity)
      // discount per item = (order - flat_off * quantity)
      // freebie = (cart + freebie_item)
      // discount_order = (order - order * percent_off) OR (order - flat_off)

    })
  }
}