import { useCallback, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const ContributeForm = ({ address }: { address: string }) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [err, setErr] = useState('');
    const onSubmit = useCallback(
        async (event) => {
            setLoading(true);
            setErr('');
            event.preventDefault();
            try {
                const accounts = await web3.eth.getAccounts();
                const campaign = Campaign(address);
                await campaign.methods.contribute().send({
                    from: accounts[0],
                    value: web3.utils.toWei(value, 'ether'),
                });
                Router.replaceRoute(`/campaigns/${address}`);
            } catch (err) {
                setErr(err.message);
            }
            setLoading(false);
        },
        [address, value]
    );
    return (
        <Form onSubmit={onSubmit} error={!!err}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    label="ether"
                    labelPosition="right"
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                ></Input>
            </Form.Field>
            <Message header="Oops" content={err} error />
            <Button loading={loading} primary>
                Contribute
            </Button>
        </Form>
    );
};

export default ContributeForm;
