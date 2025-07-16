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
