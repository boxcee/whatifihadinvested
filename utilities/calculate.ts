import Price from "../types/Price";

const calculate = (investment: number, currency: string, recurring: string, date: Date, symbol: string, prices: Price[], count: number, period: string): [number, number] => {
    let amount = 0;
    let investments = 1;
    let recurringPrices = [];
    if (recurring === 'once') {
        for (let i = 0; i < prices.length; i++) {
            const dateFromPrice = new Date(prices[i].date);
            if (date.getFullYear() === dateFromPrice.getFullYear()
                && date.getMonth() === dateFromPrice.getMonth()
                && date.getDate() === dateFromPrice.getDate()) {
                const price = prices[i].price;
                amount = investment / Number(price);
                break;
            }
        }
    } else {
        recurringPrices = buildRecurring(date, count, period);
        for (let o = 0; o < recurringPrices.length; o++) {
            const recurringDate = recurringPrices[o];
            for (let i = 0; i < prices.length; i++) {
                const dateFromPrice = new Date(prices[i].date);
                if (recurringDate.getFullYear() === dateFromPrice.getFullYear()
                    && recurringDate.getMonth() === dateFromPrice.getMonth()
                    && recurringDate.getDate() === dateFromPrice.getDate()) {
                    const price = prices[i].price;
                    amount = (investment / Number(price)) + amount;
                    break;
                }
            }
        }
    }

    if (amount === 0) {
        amount = investment / Number(prices[prices.length - 1].price)
    }

    return [amount * Number(prices[prices.length - 1].price), investments * (recurringPrices.length || 1)];
};

const getDays = (count: number, period: string): number => {
    switch (period) {
        case 'days':
            return count;
        case 'weeks':
            return count * 7;
        case 'months':
            return count * 30;
        case 'years':
            return count * 365;
        default:
            return 0;
    }
};

const buildRecurring = (date: Date, count: number, period: string): Date[] => {
    const result = [date];
    const interval = getDays(count, period);
    let tmpDate = new Date(date);
    while (Date.now() > tmpDate.getTime()) {
        tmpDate.setDate(tmpDate.getDate() + interval);
        if (Date.now() > tmpDate.getTime()) {
            result.push(new Date(tmpDate));
        }
    }
    return result;
}

export default calculate;
