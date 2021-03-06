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
            recurring: 'every',
            showRecurringSelect: false,
            period: 'months',
            count: 1,
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

        const valueToday = Math.floor(price * 100) / 100;
        const investmentToday = investment * investments;
        const increaseToday = Math.floor((price / (investmentToday) * 100) * 100) / 100;

        return (
            <Layout>
                <Head>
                    <title>What if I had invested in {name}?</title>
                    <link rel="icon" href="/favicon.ico" />
                    <meta
                        name="description"
                        content={`Calculate how much money you would have made if you had invested in ${name}.`}
                    />
                    <meta name="keywords" content={`investment, ${name}, ${symbol}, cryptocurrency`} />
                </Head>
                <Header>
                    <h1 style={{color: '#fff'}}>What if I had invested...</h1>
                </Header>
                <Content>
                    <div style={{padding: '0 50px', marginTop: 24}}>
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
                        {showPrice && (
                            <>
                                <p>You would have <b>made</b> {valueToday} {currency} by today.</p>
                                <p>You would have <b>invested</b> {investmentToday} {currency} until today.</p>
                                <p>You would have increased your investment by <b>{increaseToday}%</b>.</p>
                            </>
                        )}
                    </div>
                </Content>
                <Footer>
                    Want to start trading Cryptocurrency? Head over to <a href="https://kraken.com">kraken.com</a>!
                    <a href="https://shop.ledger.com/pages/ledger-nano-x?r=8a72acf5e6f5">
                        <img width={468} height={60} alt="Ledger Nano X - The secure hardware wallet"
                             src="https://www.ledgerwallet.com/images/promo/banners/ledger_banner_4-6-8x6-0.jpg" />
                    </a>
                </Footer>
            </Layout>
        );
    }
}

export default Symbol;

const getStockPrice = async (symbol, currency = 'usd') => {
    try {
        const res = await fetch(`https://www.kraken.com/api/internal/cryptowatch/markets/${symbol.toLowerCase()}${currency.toLowerCase()}/ohlc?periods=604800`);
        return res.json();
    } catch (error) {
        return {};
    }
}

export async function getStaticPaths() {
    const paths = coinlist
        .map((item) => `/in/${item}`);

    return {paths, fallback: false}
}

export async function getStaticProps({params}) {
    const {result} = await getStockPrice(params.symbol);

    if (!result || result.length === 0) {
        return {
            notFound: true
        };
    }

    const asset = result[0];
    const prices = asset.candlesticks.map(val => ({price: val.cp, date: val.ct * 1000}));

    return {props: {prices, symbol: params.symbol}, revalidate: (60 * 60 * 24)}
}
