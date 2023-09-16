const ShoppingCart = require('../src/ShoppingCart');
const helpers = require('../src/helpers');

describe('ShoppingCart interface', () => {
  const cart = new ShoppingCart();

  test('defines total()', () => {
    expect(typeof cart.total).toBe('function');
  });

  test('defines add()', () => {
    expect(typeof cart.add).toBe('function');
  });

  test('defines items()', () => {
    expect(typeof cart.items).toBe('function');
  });

  test('defines promoCodes()', () => {
    expect(typeof cart.promoCodes).toBe('function');
  });
});

describe('ShoppingCart items()', () => {
  beforeEach(() => {
    const mockPricing = jest.spyOn(helpers, 'getPricing');
    mockPricing.mockImplementation(() => {
      return {
        'test1': {
          'product_name': 'Test 1',
          'product_code': 'test1',
          'price': 1,
        },
        'test2': {
          'product_name': 'Test 2',
          'product_code': 'test2',
          'price': 2,
        },
        'test3': {
          'product_name': 'Test 3',
          'product_code': 'test 3',
          'price': 3,
        },
      };
    });

    const mockPromos = jest.spyOn(helpers, 'getPromos');
    mockPromos.mockImplementation(() => {
      return [{
        'promo_type': 'freebie',
        'item': 'test3',
        'free_item': 'test1',
        'minimum_quantity': 1,
      }];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('Add one product to cart', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test1');

    expect(testShoppingCart.items()).toEqual([{
      itemCode: 'test1',
      quantity: 1,
    }]);
  });

  test('Multiple product varieties to cart', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test1');
    testShoppingCart.add('test2');

    expect(testShoppingCart.items()).toEqual([
      {
        itemCode: 'test1',
        quantity: 1,
      },
      {
        itemCode: 'test2',
        quantity: 1,
      },
    ]);
  });

  test('Same product but multiple items to cart', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test1');
    testShoppingCart.add('test1');

    expect(testShoppingCart.items()).toEqual([
      {
        itemCode: 'test1',
        quantity: 2,
      },
    ]);
  });

  test('Add items with freebie promo', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test3');

    expect(testShoppingCart.items()).toEqual([
      {
        itemCode: 'test3',
        quantity: 1,
      },
      {
        itemCode: 'test1',
        quantity: 1,
      },
    ]);
  });
});

describe('ShoppingCart add()', () => {
  beforeEach(() => {
    const mockPricing = jest.spyOn(helpers, 'getPricing');
    mockPricing.mockImplementation(() => {
      return {
        'test1': {
          'product_name': 'Test 1',
          'product_code': 'test1',
          'price': 1,
        },
        'test2': {
          'product_name': 'Test 2',
          'product_code': 'test2',
          'price': 2,
        },
        'test3': {
          'product_name': 'Test 3',
          'product_code': 'test 3',
          'price': 3,
        },
      };
    });

    const mockPromos = jest.spyOn(helpers, 'getPromos');
    mockPromos.mockImplementation(() => {
      return [{
        'promo_type': 'discount_order',
        'promo_code': 'validpromocode',
        'percent_off_order': 10.0,
      }];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('Add valid item should return true', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    expect(testShoppingCart.add('test1')).toBe(true);
  });

  test('Add invalid item should return false', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    expect(testShoppingCart.add('test_fail')).toBe(false);
  });

  test('Add valid item and valid promo code should return true', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    expect(testShoppingCart.add('test1', 'validpromocode')).toBe(true);
  });

  test('Add valid item but invalid promo code should return false', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    expect(testShoppingCart.add('test_fail', 'invalidpromocode')).toBe(false);
  });
});

describe('ShoppingCart total()', () => {
  beforeEach(() => {
    const mockPricing = jest.spyOn(helpers, 'getPricing');
    mockPricing.mockImplementation(() => {
      return {
        'test1': {
          'product_name': 'Test 1',
          'product_code': 'test1',
          'price': 10,
        },
        'test2': {
          'product_name': 'Test 2',
          'product_code': 'test2',
          'price': 20,
        },
        'test3': {
          'product_name': 'Test 3',
          'product_code': 'test 3',
          'price': 30,
        },
      };
    });

    const mockPromos = jest.spyOn(helpers, 'getPromos');
    mockPromos.mockImplementation(() => {
      return [
        {
          'promo_type': 'discount_order',
          'promo_code': 'validpromocode',
          'percent_off_order': 10.0,
        },
        {
          'promo_type': 'discount_bulk',
          'item': 'test1',
          'flat_off_order': 15.00,
          'minimum_quantity': 3,
        },
        {
          'promo_type': 'discount_per_item',
          'item': 'test2',
          'flat_off_item': 5.00,
          'minimum_quantity': 3,
        },
      ];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('Correctly adds item values and quantities', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test1');
    testShoppingCart.add('test2');
    testShoppingCart.add('test3');

    expect(testShoppingCart.total()).toBe(60);
  });

  test('Apply percent off discount code', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test1');
    testShoppingCart.add('test2');
    testShoppingCart.add('test3', 'validpromocode');

    expect(testShoppingCart.total()).toBe(54);
  });

  test('Apply discount to bulk order with minimum amount', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test1');
    testShoppingCart.add('test1');
    testShoppingCart.add('test1');
    testShoppingCart.add('test1');

    expect(testShoppingCart.total()).toBe(25);
  });

  test('Apply per item discount to bulk order with minimum amount', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('test2');
    testShoppingCart.add('test2');
    testShoppingCart.add('test2');
    testShoppingCart.add('test2');

    expect(testShoppingCart.total()).toBe(60);
  });
});
