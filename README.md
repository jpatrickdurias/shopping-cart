# shopping-cart

## Running the tests

Install dependencies via npm

Run `jest` via npm `npm test -- --updateSnapshot`

## Adding a new promo type

Add new promo type logic in `ShoppingCart.js`

Add calls and conditions of the new promo to `#calcDiscounts` or `#calcFreebies`

Add new unit tests

Promo object format should be similar to https://github.com/smokycarrot/shopping-cart/blob/main/config/Promos_schema.json

## Price format

The format of new items' pricing is the following:
```
  "product_code": {
    "product_name": "product name",
    "product_code": "product_code",
    "price": number
  },
```
Simply add a new element to thge pricing config JSON or override the helper method to read from another resource

