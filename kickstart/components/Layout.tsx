import Head from 'next/head';
import { Container, Menu } from 'semantic-ui-react';
import { Link } from '../routes';

const Header = () => {
    return (
        <Menu style={{ width: '100%', marginTop: 10 }}>
            <Menu.Item as={Link} route="/">
                CrowdCoin
            </Menu.Item>
            {/* <Link route="/"><a className="item"></a></Link> */}
            <Menu.Menu position="right">
                <Menu.Item as={Link} route="/">
                    Campaigns
                </Menu.Item>

                <Menu.Item as={Link} route="/campaigns/new">
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};

export const Layout = ({ children }) => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header />
            {children}
        </Container>
    );
};
