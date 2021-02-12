import Head from 'next/head'
import Link from 'next/link';
import { Layout } from 'antd';

const {Header, Footer, Content, Sider} = Layout;

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>What if I had invested...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>Header</Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content>
          <div className="site-layout-content"><Link href="/in/ETH">...in ETH?</Link></div>
        </Content>
      </Layout>
      <Footer style={{textAlign: 'center'}}>
        Ant Design ©{new Date(Date.now()).getFullYear()} Created by Ant UED
      </Footer>
      <style jsx>{`
        .site-layout-content {
          min-height: 280px;
          padding: 24px;
          background: #fff;
        }
      `}</style>
    </Layout>
  )
}
