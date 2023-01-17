import dynamic from 'next/dynamic';
import Head from 'next/head'
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function Home() {
  return (
    <div>
      <Head>
        <title>Powereffi User Microservice Documentation</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SwaggerUI url="/api/doc" />
    </div>
  );
}
