import React from 'react';
import Head from 'next/head'
import 'antd/dist/antd.css';
import {NextRouter, withRouter} from 'next/router'
import coinlist from '../../fixtures/coinlist';
import Recurring from '../../components/Recurring';
import Investment from '../../components/Investment';
import Currency from '../../components/Currency';
import Coin from '../../components/Coin';
import DatePicker from '../../components/DatePicker';
import calculate from "../../utilities/calculate";
import Price from "../../types/Price";

interface SymbolProps {
    symbol: string;
    name: string;
    price: string;
    prices: Price[];
    router: NextRouter;
}

interface SymbolState {
    currency: string;
    showInvestmentInput: boolean;
    investment: number;
    showCurrencySelect: boolean;
    showCoinSelect: boolean;
    recurring: string;
    showRecurringSelect: boolean;
    date: Date;
    showDateSelect: boolean;
}

class Symbol extends React.Component<SymbolProps, SymbolState> {
    static getDerivedStateFromProps({router}, state) {
        if (!router?.query) {
            return state;
        }

        return {
            ...state,
            ...router.query,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(Date.now()),
            showDateSelect: false,
            currency: 'USD',
            showInvestmentInput: false,
            investment: 100,
            showCurrencySelect: false,
            showCoinSelect: false,
            recurring: 'once',
            showRecurringSelect: false,
        }
    }

    onInvestmentChangeClick = () => {
        this.setState({
            showInvestmentInput: true
        });
    };

    onInvestmentChange = (value) => {
        this.setState({
            investment: value
        });
    };

    onInvestmentEnter = (value) => {
        this.setState({
            showInvestmentInput: false
        });
    };

    onCurrencyChangeClick = () => {
        this.setState({
            showCurrencySelect: true
        });
    }

    onCurrencySelect = (value) => {
        this.setState({
            currency: value,
            showCurrencySelect: false
        });
    }

    onCoinSelect = async (value) => {
        const {router} = this.props;
        const {currency, investment} = this.state;

        this.setState({
            showCoinSelect: false
        });

        //const params = new URLSearchParams();
        //params.append("currency", currency);
        //params.append("investment", investment.toString());
        //
        //await router.push(`/i-had-invested-in/${value}?${params.toString()}`);
    }

    onCoinChangeClick = () => {
        this.setState({
            showCoinSelect: true
        });
    }

    onRecurringSelect = (value) => {
        console.log(value);
        this.setState({
            recurring: value,
            showRecurringSelect: false,
        });
    }

    onRecurringChangeClick = () => {
        this.setState({
            showRecurringSelect: true
        });
    }

    onDateChange = (date, dateString) => {
        this.setState({
            date: new Date(dateString),
            showDateSelect: false
        });
    }

    onDateChangeClick = () => {
        this.setState({
            showDateSelect: true
        });
    }

    render() {
        const {symbol, prices, name} = this.props;
        const {
            currency,
            showInvestmentInput,
            investment,
            showCurrencySelect,
            showCoinSelect,
            recurring,
            showRecurringSelect,
            date,
            showDateSelect
        } = this.state;

        const price = calculate(investment, currency, recurring, date, symbol, prices);

        console.log('investment', investment);

        return (
            <>
                <Head>
                    <title>What if I had invested in {name}?</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <h2>What if I had invested
                        &nbsp;
                        <Investment
                            investment={investment}
                            onInvestmentChange={this.onInvestmentChange}
                            onInvestmentChangeClick={this.onInvestmentChangeClick}
                            onInvestmentEnter={this.onInvestmentEnter}
                            showInvestmentInput={showInvestmentInput}
                        />
                        &nbsp;
                        <Currency
                            currency={currency}
                            showCurrencyInput={showCurrencySelect}
                            onCurrencySelect={this.onCurrencySelect}
                            onCurrencyChangeClick={this.onCurrencyChangeClick}
                        />
                        &nbsp;
                        <Recurring
                            recurring={recurring}
                            showRecurringSelect={showRecurringSelect}
                            onRecurringSelect={this.onRecurringSelect}
                            onRecurringChangeClick={this.onRecurringChangeClick}
                        />
                        {recurring === 'every' && <span>&nbsp;2 days</span>}
                        &nbsp;{recurring === 'every' ? 'starting' : 'on'}&nbsp;
                        <DatePicker
                            showDateSelect={showDateSelect}
                            date={date}
                            onDateChange={this.onDateChange}
                            onDateChangeClick={this.onDateChangeClick}
                        />
                        &nbsp;in&nbsp;
                        <Coin coin={symbol} onCoinSelect={this.onCoinSelect} showCoinSelect={showCoinSelect}
                              onCoinChangeClick={this.onCoinChangeClick} />
                        &nbsp;?</h2>
                    <h3>You would have made {Math.floor(price)} {currency} by today.</h3>
                </main>
            </>
        );
    }
}

export default withRouter(Symbol);

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
    const paths = coinlist
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

    return {props: {symbol: params.symbol, name: data.name, price, prices}, revalidate: (60 * 60 * 24)}
}
