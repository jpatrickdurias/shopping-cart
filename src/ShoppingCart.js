const helpers = require('./helpers');

module.exports = class ShoppingCart {
  /**
   * Constructor for ShoppingCart objects
   *
   * @param {object} pricingInfo Pricing info object in the format
   * {
   *   "product_code": {
   *     "product_name": "Name",
   *     "product_code": "Unique code",
   *     "price": Price in float
   *   },
   *   ...
   * }
   *
   */
  constructor(pricingInfo) {
    this.pricingInfo = pricingInfo;
    this.cart = []; // actual final cart at checkout
    this.order = [];
    this.freebies = [];
    this.input_promo_codes = [];

    this.total_amount = 0;
    this.discount = 0;

    this.available_promos = helpers.getPromos();
    this.available_promo_codes = this.available_promos.map((promo) => {
      return promo.promo_code;
    }).filter((code) => {
      return code;
    });
  }

  /**
   * total - calculates the total cost of the order with discounts calculated
   *
   * @return {float} Result
   */
  total() {
    this.#calcTotal();
    this.#calcDiscounts();
    return this.total_amount - this.discount;
  };

  /**
   * add - adds a new item into the cart
   *
   * @param {string} inputItemCode Input Item Code
   * @param {string} inputPromoCode Input Promo Code
   * @return {boolean} Success status
   */
  add(inputItemCode, inputPromoCode) {
    if (!(inputItemCode in this.pricingInfo)) return false;

    if (this.available_promo_codes.includes(inputPromoCode) &&
      !(this.input_promo_codes.includes(inputPromoCode))) {
      this.input_promo_codes.push(inputPromoCode);
    }

    const itemIndex = this.order.findIndex(
        (item) => item.itemCode === inputItemCode);

    if (itemIndex !== -1) {
      this.order[itemIndex].quantity += 1;
    } else {
      this.order.push({
        itemCode: inputItemCode,
        quantity: 1,
      });
    }

    return true;
  }

  /**
   * items - Return cart items
   * @return {Array} Array of item objects in cart with the format
   * [
   *  {
   *    itemCode: 'code',
   *    quantity: number
   *  }
   * ]
   */
  items() {
    this.#generateFinalCart();
    return this.cart;
  }

  /**
   * promoCodes - return user input promo codes
   *
   * @return {Array} Array of strings containing input promo codes
   */
  promoCodes() {
    return this.input_promo_codes;
  }

  /**
   * #calcTotal - calculate total cost and store in total_amount property
   */
  #calcTotal() {
    this.total_amount = 0;

    this.order.map((item) => {
      const price = this.pricingInfo[item.itemCode].price;

      this.total_amount += price * item.quantity;
    });
  }

  /**
   * #calcFreebies - calculate freebies to be included in the order
   */
  #calcFreebies() {
    this.available_promos.map((promo) => {
      if (promo.promo_type === 'freebie') {
        const item = this.order.find((item) => item.itemCode === promo.item);

        if (!item) return;

        const freebieCount = Math.floor(item.quantity/promo.minimum_quantity);

        const itemIndex = this.freebies.findIndex(
            (item) => item.itemCode === itemCode);

        if (itemIndex !== -1) {
          this.freebies[itemIndex].quantity += freebieCount;
        } else {
          this.freebies.push({
            itemCode: promo.free_item,
            quantity: freebieCount,
          });
        }
      }
    });
  }

  /**
   * #calcDiscounts - calculate total amount to be discounted
   *                  and store in discount property
   */
  #calcDiscounts() {
    this.discount = 0;

    this.available_promos.map((promo) => {
      if (promo.promo_type === 'discount_bulk') {
        const item = this.order.find((item) => item.itemCode === promo.item);

        if (!item) return;

        const discountCount = Math.floor(item.quantity/promo.minimum_quantity);

        if ('flat_off_order' in promo) {
          this.discount += discountCount * promo.flat_off_order;
        } else if ('percent_off_order' in promo) {
          this.discount += (
            discountCount * promo.percent_off_order * this.total_amount)/100;
        }
      } else if (promo.promo_type === 'discount_per_item') {
        const item = this.order.find((item) => item.itemCode === promo.item);

        if (!item) return;

        if (item.quantity > promo.minimum_quantity) {
          if ('flat_off_item' in promo) {
            this.discount += item.quantity * promo.flat_off_item;
          } else if ('percent_off_item' in promo) {
            this.discount += (
              item.quantity * promo.percent_off_item *
              this.pricingInfo[item.itemCode])/ 100;
          }
        }
      } else if (promo.promo_type === 'discount_order') {
        if (this.input_promo_codes.includes(promo.promo_code)) {
          this.discount += (promo.percent_off_order * this.total_amount)/100;
        }
      }
    });
  }

  /**
   * #generateFinalCart - generate and consolidate final cart items
   */
  #generateFinalCart() {
    this.#calcFreebies();

    this.cart = [...this.order];

    this.freebies.map((freeItem) => {
      const cartItemIndex= this.order.findIndex(
          (item) => item.itemCode === freeItem.itemCode);

      if (cartItemIndex !== -1) {
        this.cart[cartItemIndex].quantity += freeItem.quantity;
      } else {
        this.cart.push({
          itemCode: freeItem.itemCode,
          quantity: freeItem.quantity,
        });
      }
    });
  };
};
