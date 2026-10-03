export class Helper {
  static convertPriceToNumber(price: string): number {
    const cleanedValue = price.replace(/[^\d.]/g, '');
    return Number(cleanedValue);
  }

  static getProductDetails() {
    return {
      productName: 'MacBook',
      productQuantity: '1',
      totalPrice: '$602.00',
    };
  }

  static getLoginDetails() {
    return {
      email: 'demo123@gmail.com',
      password: 'Shailesh08',
    };
  }
}
