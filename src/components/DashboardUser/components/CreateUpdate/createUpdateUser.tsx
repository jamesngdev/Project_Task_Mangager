import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Modal,
    Select,
    notification,
} from 'antd';
import dayjs from 'dayjs';
import {useMemo} from 'react';
import {useParams} from 'react-router-dom';
import useRole from '../../../../hooks/useRole';
import {createUser, getDetailUser, updateUser} from '../../../../services/user';

const {Option} = Select;

interface Props {
    visible: boolean;
    onCancel: () => void;
    initalValues?: any;
}

const CreateUpdateUserModal = (props: Props) => {
    const {visible, onCancel, initalValues} = props;
    const {id} = useParams();
    const [form] = Form.useForm();
    const {roleOptions} = useRole();
    const queryCLient = useQueryClient();

    const {data: detailUserResponse} = useQuery({
        queryKey: ['getDetailUser', id],
        queryFn: () => getDetailUser(id),
    });

    const detailUser = useMemo(() => {
        return detailUserResponse?.data?.data || [];
    }, [detailUserResponse]);

    const detailConvert = useMemo(() => {
        return {
            ...detailUser,
            date_of_birth: dayjs(detailUser?.date_of_birth),
            roles_id: detailUser?.roles?.map((item: any) =>
                item?.id?.toString(),
            ),
            status: {
                label:
                    detailUser?.status === 1 ? 'Hoạt động' : 'Không hoạt động',
                value: detailUser?.status,
            },
        };
    }, [detailUser]);

    const {mutate: createUserMutate, isLoading} = useMutation({
        mutationFn: createUser,
        mutationKey: ['createUser'],
        onSuccess: () => {
            onCancel();
            notification.success({
                message: 'Success ',
                description: 'Create successfully',
            });
            form.resetFields();
        },
        onError: () => {
            notification.error({
                message: 'Error',
                description: 'Create failed',
            });
        },
    });

    const {mutate: updateUserMutate} = useMutation({
        mutationFn: (data: any) => updateUser(id, data),
        mutationKey: ['updateUser', id],
        onSuccess: () => {
            notification.success({
                message: 'Success ',
                description: 'Update successfully',
            });
            queryCLient.refetchQueries(['getDetailUser', id]);
        },
        onError: (error: any) => {
            notification.error({
                message: 'Error',
                description: error?.response?.data?.message,
            });
        },
    });

    const handleFinish = (values: any) => {
        if (id) {
            console.log({...values});
            updateUserMutate({
                ...values,
                date_of_birth: dayjs(values.date_of_birth).format('YYYY-MM-DD'),
                status: values.status?.value === '1' ? true : false,
            });
        } else {
            createUserMutate({
                ...values,
                date_of_birth: dayjs(values.date_of_birth).format('YYYY-MM-DD'),
                role_ids: values.roles_id,
            });
        }
        onCancel();
    };

    const statusOptions = [
        {label: 'Kích hoạt', value: '1'},
        {label: 'Chưa kích hoạt', value: '0'},
    ];

    const dateFormat = 'YYYY/MM/DD';

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            title="Create new task"
            footer={[]}
        >
            <Form
                form={form}
                onFinish={handleFinish}
                initialValues={detailConvert}
                layout="vertical"
            >
                <Form.Item name="avatar">
                    <Input type="file" placeholder="Upload ảnh" />
                </Form.Item>{' '}
                <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{required: true}]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <div className="flex justify-between">
                    {' '}
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {required: true, message: 'Vui lòng nhập email'},
                        ]}
                    >
                        <Input type="text" placeholder="Vui lòng nhập email" />
                    </Form.Item>{' '}
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {required: true, message: 'Vui lòng nhập mật khẩu'},
                        ]}
                    >
                        <Input type="text" placeholder="Nhập mật khẩu" />
                    </Form.Item>
                </div>
                <div className="flex justify-between">
                    {' '}
                    <Form.Item name="date_of_birth" label="Ngày sinh">
                        <DatePicker format={dateFormat} />
                    </Form.Item>{' '}
                    <Form.Item name="address" label="Địa chỉ">
                        <Input type="text" placeholder="Nhập địa chỉ" />
                    </Form.Item>
                </div>
                <div className="flex justify-between">
                    {' '}
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại',
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập số điện thoại" />
                    </Form.Item>{' '}
                    <Form.Item
                        name="job_title"
                        label="Chức vụ"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên chức vụ',
                            },
                        ]}
                    >
                        <Input type="text" placeholder="Nhập tên chức vụ" />
                    </Form.Item>{' '}
                </div>
                <div className="grid grid-cols-2 gap-10">
                    {' '}
                    <Form.Item
                        className=""
                        name="status"
                        label="Trạng thái"
                        rules={[{required: true, message: 'Chọn trạng thái'}]}
                    >
                        <Select
                            fieldNames={{label: 'label', value: 'value'}}
                            placeholder="Chọn trạng thái"
                            options={statusOptions}
                        ></Select>
                    </Form.Item>
                </div>
                <div className="flex flex-col">
                    <Form.Item
                        name="roles_id"
                        label="Phân quyền"
                        rules={[
                            {required: true, message: 'Vui lòng phân quyền'},
                        ]}
                    >
                        <Checkbox.Group
                            options={roleOptions}
                            className="flex flex-col"
                        />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button
                        disabled={isLoading}
                        htmlType="submit"
                        block
                        type="primary"
                        className="!text-center !block"
                        size="large"
                    >
                        {isLoading ? 'Loading...' : 'Submit'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUpdateUserModal;
