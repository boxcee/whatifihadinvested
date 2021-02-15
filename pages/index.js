import Head from 'next/head'
import { Layout, Select } from 'antd';
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const {Content} = Layout;
const {Option} = Select;

export default function Home({coins = []}) {
  const router = useRouter();
  const {locale} = router;
  return (
    <Layout>
      <Head>
        <title>What if I had invested...</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={`Calculate how much money you would have made if you had invested in some stock or cryptocurrency.`}
        />
        <meta name="keywords" content="investment, stock, cryptocurrency" />
      </Head>
      <Content>
        <h1>What if I had invested...?</h1>
        <p>Always wanted to know how much money you could have made if you had invested into cryptocurrency X at time
          Y?</p>
        <p>Don't beat yourself up about a missed opportunity. You can also calculate how much you could have made if had
          only invested a smaller amount of money on a recurring basis. Not every has a few thousand $ lying around to
          invest.</p>
        <ul>
          {coins.map(({asset, name}) => (
            <li key={asset}>...in <Link href={`/in/${asset}`} locale={locale}>{name}</Link>?</li>))}
        </ul>
      </Content>
    </Layout>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://www.kraken.com/api/internal/cryptowatch/markets/assets?asset=USD&limit=100');
  const {result} = await res.json();
  return {props: {coins: result}};
}
