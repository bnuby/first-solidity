import { useCallback, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Layout } from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const CampaignNew = () => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState('');
    const [error, setError] = useState('');

    const onSubmit = useCallback(
        async (event) => {
            setLoading(true);
            setError('');
            event.preventDefault();
            console.log('on submit');
            try {
                const accounts = await web3.eth.getAccounts();
                await factory.methods.createCampaign(state).send({
                    from: accounts[0],
                });
                Router.pushRoute('/');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        [state]
    );

    return (
        <Layout>
            <h3>New Campaign!</h3>
            <Form onSubmit={onSubmit} error={!!error}>
                <Form.Field>
                    <label>Minimun contribution</label>
                    <Input
                        label="wei"
                        placeholder="100.00"
                        labelPosition="right"
                        value={state}
                        onChange={(e) => setState(e.currentTarget.value)}
                    />
                </Form.Field>
                <Message error  header="Oops!" content={error} />
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </Layout>
    );
};

export default CampaignNew;
