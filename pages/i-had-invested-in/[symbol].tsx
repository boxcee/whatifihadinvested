const getStockPrice = async (symbol) => {
    const from = new Date(Date.now());
    from.setDate(from.getDate() - (365 * 30));
    const fromString = from.toISOString().replace(/:[0-9\.]+Z$/, '');

    const to = new Date(Date.now());
    to.setDate(from.getDate() + (365 * 30));
    const toString = to.toISOString().replace(/:[0-9\.]+Z$/, '');

    try {
        const res = await fetch(`https://production.api.coindesk.com/v2/price/values/${symbol.toUpperCase()}?start_date=${fromString}&end_date=${toString}&ohlc=false`);
        return res.json();
    } catch (error) {
        return {};
    }
}

function Symbol(props) {
    return <div>{props.symbol}: {props.price}</div>
}

export default Symbol;

export async function getStaticPaths() {
    // const res = await fetch('https://coinlib.io/searchable_items_json')
    // const data = await res.json()

    const data = ['BTC', 'ETH', 'XRP', 'BCH', 'ADA', 'XLM', 'NEO', 'LTC', 'EOS', 'XEM', 'IOTA', 'DASH', 'XMR', 'TRX', 'ICX', 'ETC', 'QTUM', 'BTG', 'LSK', 'USDT', 'OMG', 'ZEC', 'SC', 'ZRX', 'REP', 'WAVES', 'MKR', 'DCR', 'BAT', 'LRC', 'KNC', 'BNT', 'LINK', 'CVC', 'STORJ', 'ANT', 'SNGLS', 'MANA', 'MLN', 'DNT', 'NMR', 'DAI', 'ATOM', 'XTZ', 'NANO', 'WBTC', 'BSV', 'DOGE', 'USDC', 'OXT', 'ALGO', 'BAND', 'BTT', 'FET', 'KAVA', 'PAX', 'PAXG', 'REN'];

    const paths = data
        .map((item) => `/i-had-invested-in/${item}`)

    return {paths, fallback: false}
}

export async function getStaticProps({params}) {
    const {data} = await getStockPrice(params.symbol);

    if (!data || !data.entries) {
        return {
            notFound: true
        };
    }

    const prices = data.entries.map(([, price], index) => {
        const start = new Date(data.ingestionStart);
        start.setDate(start.getDate() + index)
        return {
            price,
            date: start.toISOString()
        };
    });

    const {price} = prices[prices.length - 1]

    return {props: {symbol: params.symbol, price, prices}}
}
