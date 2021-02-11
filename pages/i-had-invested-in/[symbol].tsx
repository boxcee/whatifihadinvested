import React from 'react';
import Head from 'next/head'
import {InputNumber, Select} from 'antd';
import 'antd/dist/antd.css';

const {Option} = Select;
const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

interface SymbolProps {
    symbol: string;
    price: string;
}

interface SymbolState {
    from: string;
    currencyInput: string;
    showInvestmentInput: boolean;
    investmentInput: number;
    showCurrencyInput: boolean;
}

function Currency({
                      showCurrencyInput,
                      currencyInput,
                      onCurrencySelect,
                      onCurrencyChangeClick
                  }) {
    return showCurrencyInput ?
        <Select defaultValue={currencyInput} open={true}
                onSelect={onCurrencySelect}>{['EUR', 'USD'].map((currency) => (
            <Option value={currency}>{currency}</Option>))}</Select> :
        <a onClick={onCurrencyChangeClick}>{currencyInput}</a>;
}

function Investment({
                        showInvestmentInput,
                        investmentInput,
                        onInvestmentChange,
                        onInvestmentEnter,
                        onInvestmentChangeClick
                    }) {
    return showInvestmentInput ?
        <InputNumber value={investmentInput} onChange={onInvestmentChange}
                     onPressEnter={onInvestmentEnter} /> :
        <a onClick={onInvestmentChangeClick}>{investmentInput}</a>
}

class Symbol extends React.Component<SymbolProps, SymbolState> {
    constructor(props) {
        super(props);
        this.state = {
            from: new Date(Date.now()).toLocaleDateString(undefined, options),
            currencyInput: 'USD',
            showInvestmentInput: false,
            investmentInput: 100,
            showCurrencyInput: false,
        }
    }

    onInvestmentChangeClick = () => {
        this.setState({
            showInvestmentInput: true
        });
    };

    onInvestmentChange = (value) => {
        this.setState({
            investmentInput: value
        });
    };

    onInvestmentEnter = () => {
        this.setState({
            showInvestmentInput: false
        });
    };

    onCurrencyChangeClick = () => {
        this.setState({
            showCurrencyInput: true
        });
    }

    onCurrencySelect = (value) => {
        this.setState({
            currencyInput: value,
            showCurrencyInput: false
        });
    }

    render() {
        const {symbol, price} = this.props;
        const {currencyInput, showInvestmentInput, investmentInput, showCurrencyInput} = this.state;

        return (
            <>
                <Head>
                    <title>What if I had invested in {symbol}?</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <h2>What if I had invested
                        &nbsp;
                        <Investment
                            investmentInput={investmentInput}
                            onInvestmentChange={this.onInvestmentChange}
                            onInvestmentChangeClick={this.onInvestmentChangeClick}
                            onInvestmentEnter={this.onInvestmentEnter}
                            showInvestmentInput={showInvestmentInput}
                        />
                        &nbsp;
                        <Currency
                            currencyInput={currencyInput}
                            showCurrencyInput={showCurrencyInput}
                            onCurrencySelect={this.onCurrencySelect}
                            onCurrencyChangeClick={this.onCurrencyChangeClick}
                        />
                        &nbsp;once
                        on {new Date(Date.now()).toLocaleDateString(undefined, options)} in {symbol}?</h2>
                    <div>{symbol} = {price}</div>
                </main>
            </>
        );
    }
}

export default Symbol;

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

export async function getStaticPaths() {
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

    return {props: {symbol: params.symbol, price, prices}, revalidate: (60 * 60 * 24)}
}
