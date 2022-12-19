import { Layout } from '../../../components/Layout';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import { Button, Grid, Table } from 'semantic-ui-react';
import { useMemo, useState } from 'react';
import RequestRow from '../../../components/RequestRow';

type RequestType = {
    address: string;
    numRequest: number;
    approversCount: number;
    requests: any[];
};

const RequestIndex = (props: RequestType) => {
    const { address, numRequest, approversCount, requests } = props;
    const requestRow = useMemo(() => {
        return requests.map((request, idx) => (
            <RequestRow
                key={idx}
                id={idx}
                request={request}
                approversCount={approversCount}
                address={address}
            />
        ));
    }, [requests, address, approversCount]);

    return (
        <Layout>
            <h3>Pending Requests</h3>
            <Link route={`/campaigns/${address}/requests/new`} legacyBehavior>
                <a>
                    <Button
                        floated="right"
                        style={{ marginBottom: 10 }}
                        fullWidth
                        primary
                    >
                        Add Request
                    </Button>
                </a>
            </Link>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Completed</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                            Approve
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                            Finalize
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{requestRow}</Table.Body>
            </Table>
            <div>
                Found {numRequest} requests.
            </div>
        </Layout>
    );
};

RequestIndex.getInitialProps = async (ctx) => {
    const address = ctx.query.address;
    const campaign = Campaign(address);
    const numRequest = await campaign.methods.numRequest().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(
        Array(parseInt(numRequest))
            .fill(0)
            .map((_, idx) => campaign.methods.requests(idx).call())
    );
    return { address, numRequest, approversCount, requests };
};

export default RequestIndex;
