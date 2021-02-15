import Head from 'next/head'
import { Layout, Select } from 'antd';
import React from "react";
import { useRouter } from "next/router";

const {Content, Header} = Layout;
const {Option} = Select;

export default function Home({coins = []}) {
  const router = useRouter();
  const {locale} = router;

  const onSelect = (value) => {
    router.push(`/in/${value}`);
  };

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
      <Header style={{backgroundColor: '#1b8366'}}>
        <h1 style={{color: '#fff'}}>What if I had invested...?</h1>
      </Header>
      <Content>
        <div style={{padding: '0 50px', marginTop: 24, marginBottom: 24}}>
          <p>Always wanted to know how much money you could have made if you had invested into cryptocurrency X at time
            Y?</p>
          <p>Don't beat yourself up about a missed opportunity. You can also calculate how much you could have made if
            had
            only invested a smaller amount of money on a recurring basis. Not every has a few thousand $ lying around to
            invest.</p>
          <Select defaultValue={coins[0].asset} onSelect={onSelect}>
            {coins.map(({asset, name}) => (
              <Option value={asset} key={asset}>
                ...in {name}?
              </Option>
            ))}
          </Select>
        </div>
      </Content>
    </Layout>
  )
}

export async function getStaticProps() {
  let coins = [];
  try {
    const res = await fetch('https://www.kraken.com/api/internal/cryptowatch/markets/assets?asset=USD&limit=100');
    const {result} = await res.json();
    coins = result;
  } catch (error) {
    console.error(error);
  }
  return {props: {coins}};
}
