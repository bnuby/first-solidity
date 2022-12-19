import Campaign from '../../ethereum/campaign';
import { Layout } from '../../components/Layout';
import { useMemo } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';

const CampaignShow = (props: {
    address: string;
    minimunContribute: number;
    balance: number;
    numRequest: number;
    approversCount: number;
    manager: string;
}) => {
    const { address } = props;
    const items = useMemo(() => {
        const {
            manager,
            minimunContribute,
            numRequest,
            approversCount,
            balance,
        } = props;
        return [
            {
                header: manager,
                meta: 'Address of Manager',
                description:
                    'The manager created this campaign and can create requests to withdraw money',
                style: {
                    overflowWrap: 'break-word',
                },
            },
            {
                header: minimunContribute,
                meta: 'Minimun Contribution',
                description:
                    'You must contribute at least this much wei to become an approver',
            },
            {
                header: numRequest,
                meta: 'Number of Requests',
                description:
                    'A request tries to withdraw morney from the contract. Request must be approve by approvers',
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description:
                    'Number of people who have already donated to this campaign',
            },
            {
                header: web3.utils.fromWei(`${balance}`, 'ether'),
                meta: 'Campaign Balance (ether)',
                description:
                    'The balance is how much money this campaign has left to spend.',
            },
        ];
    }, [props]);
    return (
        <Layout>
            <h3>Campaign details</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column
                        largeScreen={10}
                        tablet={10}
                        mobile={16}
                    >
                        <Card.Group itemsPerRow={2} items={items} />
                    </Grid.Column>
                    <Grid.Column
                        largeScreen={6}
                        tablet={6}
                        mobile={16}
                    >
                        <ContributeForm address={address} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link
                            route={`/campaigns/${address}/requests`}
                            legacyBehavior
                        >
                            <a>
                                <Button primary>View Requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
};

CampaignShow.getInitialProps = async (props) => {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods
        .getSummary()
        .call()
        .then(
            ({
                0: minimunContribute,
                1: balance,
                2: numRequest,
                3: approversCount,
                4: manager,
            }) => ({
                minimunContribute,
                balance,
                numRequest,
                approversCount,
                manager,
            })
        );
    console.log(summary);
    return {
        ...summary,
        address: props.query.address,
    };
};

export default CampaignShow;
