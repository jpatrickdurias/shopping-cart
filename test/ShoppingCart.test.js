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

describe('Amaysim expected outcomes', () => {
  beforeEach(() => {
    const mockPricing = jest.spyOn(helpers, 'getPricing');
    mockPricing.mockImplementation(() => {
      return {
        'ult_small': {
          'product_name': 'Unlimited 1GB',
          'product_code': 'ult_small',
          'price': 24.90,
        },
        'ult_medium': {
          'product_name': 'Unlimited 2GB',
          'product_code': 'ult_medium',
          'price': 29.90,
        },
        'ult_large': {
          'product_name': 'Unlimited 5GB',
          'product_code': 'ult_large',
          'price': 44.90,
        },
        '1gb': {
          'product_name': '1 GB Data-pack',
          'product_code': '1gb',
          'price': 9.90,
        },
      };
    });

    const mockPromos = jest.spyOn(helpers, 'getPromos');
    mockPromos.mockImplementation(() => {
      return [
        {
          'promo_type': 'discount_bulk',
          'item': 'ult_small',
          'flat_off_order': 24.90,
          'minimum_quantity': 3,
        },
        {
          'promo_type': 'discount_per_item',
          'item': 'ult_large',
          'flat_off_item': 5.00,
          'minimum_quantity': 3,
        },
        {
          'promo_type': 'freebie',
          'item': 'ult_medium',
          'free_item': '1gb',
          'minimum_quantity': 1,
        },
        {
          'promo_type': 'discount_order',
          'percent_off_order': 10.0,
          'promo_code': 'I<3AMAYSIM',
        },
      ];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('Scenario 1', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('ult_small');
    testShoppingCart.add('ult_small');
    testShoppingCart.add('ult_small');
    testShoppingCart.add('ult_large');

    expect(testShoppingCart.total()).toBe(94.70);
    expect(testShoppingCart.items()).toEqual([
      {
        itemCode: 'ult_small',
        quantity: 3,
      },
      {
        itemCode: 'ult_large',
        quantity: 1,
      },
    ]);
  });

  test('Scenario 2', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('ult_small');
    testShoppingCart.add('ult_small');
    testShoppingCart.add('ult_large');
    testShoppingCart.add('ult_large');
    testShoppingCart.add('ult_large');
    testShoppingCart.add('ult_large');

    expect(testShoppingCart.total()).toBe(209.40);
    expect(testShoppingCart.items()).toEqual([
      {
        itemCode: 'ult_small',
        quantity: 2,
      },
      {
        itemCode: 'ult_large',
        quantity: 4,
      },
    ]);
  });

  test('Scenario 3', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('ult_small');
    testShoppingCart.add('ult_medium');
    testShoppingCart.add('ult_medium');

    expect(testShoppingCart.total()).toBe(84.70);
    expect(testShoppingCart.items()).toEqual([
      {
        itemCode: 'ult_small',
        quantity: 1,
      },
      {
        itemCode: 'ult_medium',
        quantity: 2,
      },
      {
        itemCode: '1gb',
        quantity: 2,
      },
    ]);
  });

  test('Scenario 4', () => {
    const testPricingInfo = helpers.getPricing();
    const testShoppingCart = new ShoppingCart(testPricingInfo);

    testShoppingCart.add('ult_small');
    testShoppingCart.add('1gb', 'I<3AMAYSIM');

    expect(testShoppingCart.total()).toBe(31.32);
    expect(testShoppingCart.items()).toEqual([
      {
        itemCode: 'ult_small',
        quantity: 1,
      },
      {
        itemCode: '1gb',
        quantity: 1,
      },
    ]);
  });
});
