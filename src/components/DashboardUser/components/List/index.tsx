import {useQuery} from '@tanstack/react-query';
import {Button, Input} from 'antd';
import {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getListUserInSystem} from '../../../../services/user';
import Pagination from '../../../Pagination';
import CreateUpdateUserModal from '../CreateUpdate/createUpdateUser';
import UserItem from '../Item/item';

const ListUser = () => {
    const [page, setPage] = useState(1);
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const router = useNavigate();

    const {isLoading, data: listUserResponse} = useQuery({
        queryKey: ['getListUserInSystem', page],
        queryFn: () => getListUserInSystem(page),
        keepPreviousData: true,
    });

    const listUser = useMemo(() => {
        return listUserResponse?.data?.data || [];
    }, [listUserResponse]);

    const total = useMemo(() => {
        return listUserResponse?.data?.meta?.total || 0;
    }, [listUserResponse]);

    return (
        <>
            <div className="mb-10 text-lg">
                <div className="mb-2 text-lg font-semibold">
                    Danh sách người dùng
                </div>
            </div>
            <div className="flex flex-col p-10 bg-white rounded-lg">
                <div className="flex justify-end gap-3 mb-10">
                    <Input placeholder="Nhập người dùng" />
                    <Button type="primary" size={'large'}>
                        Tìm kiếm
                    </Button>
                    <Button
                        className="text-white bg-blue-500"
                        size={'large'}
                        onClick={() => {
                            setIsShowCreateModal(true);
                        }}
                    >
                        Thêm người dùng
                    </Button>
                </div>
                <div className="flex flex-col text-xl">
                    <div className="grid grid-cols-8 pb-4 text-xs font-semibold text-gray-400 border-bottom">
                        <div className="col-span-2">NGƯỜI DÙNG</div>
                        <div className="col-span-2">EMAIL</div>
                        <div className="">SỐ ĐIỆN THOẠI</div>
                        <div className="">CHỨC VỤ</div>
                        <div className="">TRẠNG THÁI</div>
                        <div className="text-center">ACTION</div>
                    </div>
                    {listUser.map((user: any) => {
                        return (
                            <>
                                <UserItem user={user} key={user?.name} />
                            </>
                        );
                    })}
                </div>
            </div>
            <div className="mt-5">
                <Pagination
                    currentPage={page}
                    totalCount={total}
                    pageSize={10}
                    onPageChange={(page: any) => setPage(page)}
                />
            </div>
            {
                <CreateUpdateUserModal
                    visible={isShowCreateModal}
                    onCancel={() => setIsShowCreateModal((pre) => !pre)}
                />
            }
        </>
    );
};

export default ListUser;
