import { useCallback, useState } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const { Row, Cell } = Table;

type Props = {
    id: number;
    request: any;
    approversCount: number;
    address: string;
};

const RequestRow = (props: Props) => {
    const { id, address, approversCount, request } = props;
    const { description, value, recipient, complete, approvalCount } = request;
    const [loading, setLoading] = useState(false);

    const approveRequest = useCallback(
        async (idx) => {
            setLoading(true);
            try {
                const campaign = Campaign(address);
                const [account] = await web3.eth.getAccounts();
                console.log(campaign.methods.approveRequest(idx));
                await campaign.methods.approveRequest(idx).send({
                    from: account,
                });
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
            Router.replaceRoute(`/campaigns/${address}/requests`);
        },
        [address]
    );

    const finalizeRequest = useCallback(
        async (idx) => {
            setLoading(true);
            try {
                const campaign = Campaign(address);
                const [account] = await web3.eth.getAccounts();
                await campaign.methods.finalizeRequest(idx).send({
                    from: account,
                });
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
            Router.replaceRoute(`/campaigns/${address}/requests`);
        },
        [address]
    );

    const readyToFinalize = approvalCount > approversCount / 2;

    return (
        <Row disabled={complete} positive={readyToFinalize && !complete}>
            <Cell>{id}</Cell>
            <Cell>{description}</Cell>
            <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
            <Cell>{recipient}</Cell>
            <Cell>{complete.toString()}</Cell>
            <Cell>
                {approvalCount}/{approversCount}
            </Cell>
            <Cell textAlign="center">
                {!complete && (
                    <Button
                        loading={loading}
                        color="green"
                        disabled={approvalCount === approversCount}
                        onClick={() => approveRequest(id)}
                        basic
                    >
                        Approve
                    </Button>
                )}
            </Cell>
            <Cell textAlign="center">
                {!complete && (
                    <Button
                        color="red"
                        disabled={!readyToFinalize}
                        loading={loading}
                        onClick={() => finalizeRequest(id)}
                        basic
                    >
                        Finalize
                    </Button>
                )}
            </Cell>
        </Row>
    );
};
export default RequestRow;
