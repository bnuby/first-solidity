import { useCallback, useState } from 'react';
import { Button, Form, Input, Message, TextArea } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import { Layout } from '../../../components/Layout';
import web3 from '../../../ethereum/web3';
import { Router, Link } from '../../../routes';

type Form = {
    description: string;
    value: string;
    recipient: string;
};

const RequestNew = (props) => {
    const address = props.address;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState<Form>({
        description: '',
        value: '',
        recipient: '',
    });

    const onChange = useCallback(
        <T extends keyof Form>(key: T, value: Form[T]) => {
            setForm((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        },
        []
    );

    const onSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setLoading(true);
            setError('');
            try {
                const [account] = await web3.eth.getAccounts();
                const campaign = Campaign(address);
                await campaign.methods
                    .createRequest(
                        form.description,
                        web3.utils.toWei(form.value, 'ether'),
                        form.recipient
                    )
                    .send({
                        from: account,
                    });
                Router.back();
            } catch (e) {
                setError(e.message);
            }
            setLoading(false);
        },
        [form]
    );

    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`} legacyBehavior>
                <a>Back</a>
            </Link>
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmit} error={!!error}>
                <Form.Field>
                    <label>Description</label>
                    <TextArea
                        value={form.description}
                        onChange={(e) =>
                            onChange('description', e.currentTarget.value)
                        }
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        labelPosition="right"
                        label="ether"
                        value={form.value}
                        onChange={(e) =>
                            onChange('value', e.currentTarget.value)
                        }
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={form.recipient}
                        onChange={(e) =>
                            onChange('recipient', e.currentTarget.value)
                        }
                    />
                </Form.Field>
                <Message error header="Oops" content={error}></Message>
                <Button primary loading={loading}>
                    Create
                </Button>
            </Form>
        </Layout>
    );
};

RequestNew.getInitialProps = (ctx) => {
    const address = ctx.query.address;
    return { address };
};

export default RequestNew;
