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
