import React from 'react';
import Head from 'next/head'
import {Layout} from 'antd';
import coinlist from '../../fixtures/coinlist';
import Recurring from '../../components/Recurring';
import Investment from '../../components/Investment';
import Currency from '../../components/Currency';
import Coin from '../../components/Coin';
import DatePicker from '../../components/DatePicker';
import calculate from "../../utilities/calculate";
import Price from "../../types/Price";
import Period from "../../components/Period";

const {Content, Header, Footer} = Layout;

interface SymbolProps {
    symbol: string;
    name: string;
    price: string;
    prices: Price[];
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
    period: string;
    count: number;
    showPeriodSelect: boolean;
    showCountSelect: boolean;
}

class Symbol extends React.Component<SymbolProps, SymbolState> {
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
            period: 'days',
            count: 2,
            showCountSelect: false,
            showPeriodSelect: false,
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
        this.setState({
            showCoinSelect: false
        });
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
        console.log(dateString);

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

    onCountChangeClick = () => {
        this.setState({
            showCountSelect: true
        });
    }

    onCountSelect = (value) => {
        this.setState({
            count: value,
            showCountSelect: false,
            showPeriodSelect: false
        });
    }

    onPeriodChangeClick = () => {
        this.setState({
            showPeriodSelect: true
        });
    }

    onPeriodSelect = (value) => {
        this.setState({
            period: value,
            showPeriodSelect: false,
            showCountSelect: false
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
            showDateSelect,
            period,
            count,
            showCountSelect,
            showPeriodSelect,
        } = this.state;

        const showPrice = (!showPeriodSelect
            && !showCountSelect
            && !showDateSelect
            && !showRecurringSelect
            && !showInvestmentInput
            && !showCurrencySelect);

        const [price, investments] = showPrice
            ? calculate(investment, currency, recurring, date, symbol, prices, count, period)
            : [null, null];

        return (
            <Layout>
                <Head>
                    <title>What if I had invested in {name}?</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Header>
                    <h1 style={{color: '#fff'}}>What if I had invested...</h1>
                </Header>
                <Content>
                    <div style={{width: 768, marginLeft: 'auto', marginRight: 'auto', marginTop: 36}}>
                        <h2>...
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
                            <Period
                                recurring={recurring}
                                period={period}
                                count={count}
                                showCountSelect={showCountSelect}
                                showPeriodSelect={showPeriodSelect}
                                onCountChangeClick={this.onCountChangeClick}
                                onPeriodChangeClick={this.onPeriodChangeClick}
                                onCountSelect={this.onCountSelect}
                                onPeriodSelect={this.onPeriodSelect}
                            />
                            &nbsp;{recurring === 'every' ? 'starting' : 'on'}&nbsp;
                            <DatePicker
                                showDateSelect={showDateSelect}
                                date={date}
                                onDateChange={this.onDateChange}
                                onDateChangeClick={this.onDateChangeClick}
                            />
                            &nbsp;in&nbsp;
                            <Coin
                                coin={symbol}
                                onCoinSelect={this.onCoinSelect}
                                showCoinSelect={showCoinSelect}
                                onCoinChangeClick={this.onCoinChangeClick}
                            />
                            ?</h2>
                    </div>
                    {showPrice && (
                        <div style={{width: 768, marginLeft: 'auto', marginRight: 'auto'}}>
                            <p>You would have <b>made</b> {Math.floor(price * 100) / 100} {currency} by today.</p>
                            <p>You would have <b>invested</b> {investment * investments} {currency} until today.</p>
                            <p>You would have increased your investment
                                by <b>{Math.floor((price / (investment * investments) * 100) * 100) / 100}%</b>.</p>
                        </div>
                    )}
                </Content>
                <Footer>
                    <a href={`https://www.kraken.com/en-us/prices/${symbol.toLowerCase()}-${name.toLowerCase()}-price-chart`}>
                        Want to start buying {name}?
                    </a>
                </Footer>
            </Layout>
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
    const paths = coinlist
        .map((item) => `/in/${item}`)

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
