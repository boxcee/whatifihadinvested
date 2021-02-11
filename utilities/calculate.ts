import Price from "../types/Price";

const calculate = (investment: number, currency: string, recurring: string, date: Date, symbol: string, prices: Price[]): number => {
    let amount = 0;
    for (let i = 0; i < prices.length; i++) {
        const dateFromPrice = new Date(prices[i].date);
        if (date.getFullYear() === dateFromPrice.getFullYear()
            && date.getMonth() === dateFromPrice.getMonth()
            && date.getDate() === dateFromPrice.getDate()) {
            const price = prices[i].price;
            amount = investment / Number(price);
        }
    }
    return amount * Number(prices[prices.length - 1].price);
};

export default calculate;
