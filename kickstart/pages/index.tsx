import { useEffect } from 'react';
import { Button, Card } from 'semantic-ui-react';
import { Layout } from '../components/Layout';
import factory from '../ethereum/factory';
import { Link } from '../routes';

const renderCampaigns = (campaigns: string[]) => {
    const items = campaigns.map((i) => ({
        header: i,
        description: <Link route={`/campaigns/${i}`}>View Campaign</Link>,
        fluid: true,
        style: {
            overflowWrap: 'break-word',
        },
    }));
    return <Card.Group items={items} />;
};

function Index({ campaigns }) {
    useEffect(() => {
        console.log(campaigns);
    }, [campaigns]);
    return (
        <Layout>
            <h3>Open Campaigns</h3>
            <Link route="/campaigns/new" legacyBehavior>
                <Button
                    floated="right"
                    content="Create Campaign"
                    icon="add circle"
                    primary
                />
            </Link>
            {renderCampaigns(campaigns)}
        </Layout>
    );
}

Index.getInitialProps = async () => {
    const campaigns = await factory.methods
        .getDeployedCampaigns()
        .call()
        .catch(console.error);

    return {
        campaigns,
    };
};

export default Index;
