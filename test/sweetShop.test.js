import { SweetShop } from '../src/sweetShop.js';

describe('SweetShop - Add Sweets', () => {
  it('should add a new sweet to the shop', () => {
    const shop = new SweetShop();
    shop.addSweet({ id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });

    const sweets = shop.getAllSweets();
    expect(sweets.length).toBe(1);
    expect(sweets[0].name).toBe('Kaju Katli');
  });

  it('should not allow adding sweet with duplicate ID', () => {
    const shop = new SweetShop();
    shop.addSweet({ id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });

    expect(() => {
      shop.addSweet({ id: 1001, name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 10 });
    }).toThrow('Sweet with this ID already exists.');
  });
});

describe('SweetShop - Delete Sweets', () => {
  it('should delete a sweet by ID', () => {
    const shop = new SweetShop();
    shop.addSweet({ id: 2001, name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 10 });

    shop.deleteSweet(2001);
    const sweets = shop.getAllSweets();
    expect(sweets.length).toBe(0);
  });

  it('should throw error when trying to delete a non-existing sweet', () => {
    const shop = new SweetShop();
    expect(() => {
      shop.deleteSweet(9999);
    }).toThrow('Sweet with this ID does not exist.');
  });
});

describe('SweetShop - View Sweets', () => {
  it('should return all available sweets in the shop', () => {
    const shop = new SweetShop();

    shop.addSweet({ id: 1, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
    shop.addSweet({ id: 2, name: 'Gajar Halwa', category: 'Vegetable-Based', price: 30, quantity: 15 });

    const sweets = shop.getAllSweets();
    expect(sweets).toHaveLength(2);
    expect(sweets[0].name).toBe('Kaju Katli');
    expect(sweets[1].name).toBe('Gajar Halwa');
  });
});

describe('SweetShop - Search & Sort', () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();
    shop.addSweet({ id: 1, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 });
    shop.addSweet({ id: 2, name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 10 });
    shop.addSweet({ id: 3, name: 'Gajar Halwa', category: 'Vegetable-Based', price: 40, quantity: 5 });
  });

  it('should search sweets by name (case-insensitive)', () => {
    const result = shop.searchByName('gUlAb');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Gulab Jamun');
  });

  it('should search sweets by category (case-insensitive)', () => {
    const result = shop.searchByCategory('milk-based');
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('Milk-Based');
  });

  it('should search sweets within a price range', () => {
    const result = shop.searchByPriceRange(30, 45);
    expect(result).toHaveLength(2);
    expect(result.map(s => s.name)).toContain('Gulab Jamun');
    expect(result.map(s => s.name)).toContain('Gajar Halwa');
  });

  it('should return sweets sorted by price ascending', () => {
    const result = shop.sortByPrice();
    expect(result[0].price).toBe(30);
    expect(result[2].price).toBe(50);
  });

  it('should return sweets sorted by name alphabetically', () => {
    const result = shop.sortByName();
    expect(result.map(s => s.name)).toEqual(['Gajar Halwa', 'Gulab Jamun', 'Kaju Katli']);
  });
});

describe('SweetShop - Purchase Sweets', () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();
    shop.addSweet({ id: 1, name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 10 });
  });

  it('should decrease quantity after purchase', () => {
    shop.purchaseSweet(1, 3);
    const sweet = shop.getAllSweets().find(s => s.id === 1);
    expect(sweet.quantity).toBe(7);
  });

  it('should throw error if sweet does not exist', () => {
    expect(() => {
      shop.purchaseSweet(9999, 2);
    }).toThrow('Sweet with this ID does not exist.');
  });

  it('should throw error if not enough stock is available', () => {
    expect(() => {
      shop.purchaseSweet(1, 20);
    }).toThrow('Not enough stock available.');
  });
});

describe('SweetShop - Restock Sweets', () => {
  let shop;

  beforeEach(() => {
    shop = new SweetShop();
    shop.addSweet({ id: 1, name: 'Rasgulla', category: 'Milk-Based', price: 25, quantity: 10 });
  });

  it('should increase quantity when restocked', () => {
    shop.restockSweet(1, 5);
    const sweet = shop.getAllSweets().find(s => s.id === 1);
    expect(sweet.quantity).toBe(15);
  });

  it('should throw error when restocking a non-existent sweet', () => {
    expect(() => {
      shop.restockSweet(9999, 10);
    }).toThrow('Sweet with this ID does not exist.');
  });
});
