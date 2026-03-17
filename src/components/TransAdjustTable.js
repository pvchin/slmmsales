import React, { useState, useMemo } from 'react';
import currency from 'currency.js';
import { branch } from '../utils/constants';
import { Toast } from '../helpers/CustomToastify';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  //ModalHeader,
  //ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import {
  tranadjustState,
  tranadjustdetlsState,
  editTranadjustIdState,
  editTranadjustDetlsIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomReactTable from '../helpers/CustomReactTable';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useTransadjust } from '../react-query/transadjust/useTransadjust';
import { useAddTransadjust } from '../react-query/transadjust/useAddTransadjust';
import { useDeleteTransadjust } from '../react-query/transadjust/useDeleteTransadjust';
import { useUpdateTransadjust } from '../react-query/transadjust/useUpdateTransadjust';
import { useTransadjustDetls } from '../react-query/transadjustdetls/useTransadjustsDetls';
import { useDeleteTransAdjustDetls } from '../react-query/transadjustdetls/useDeleteTransAdjustDetls';
import { useAddTransAdjustDetls } from '../react-query/transadjustdetls/useAddTransAdjustDetls';
import { useItemsHistory } from '../react-query/itemshistory/useItemsHistory';
import { useDeleteItemsHistory } from '../react-query/itemshistory/useDeteteItemsHistory';
import TransAdjustForm from './TransAdjustForm';

const initial_tran = {
  ta_batchno: '',
  ta_date: dayjs().format('YYYY-MM-DD'),
  ta_type: 'Adjustment',
  ta_userid: '',
  ta_user: '',
  ta_scno: '',
  ta_sc: '',
  ta_branch: branch,
  ta_remark: '',
  ta_post: '0',
  ta_subtotal: 0,
  ta_disc: 0,
  ta_nettotal: 0,
};

const TransTable = () => {
  const navigate = useNavigate();
  const { transadjust, setTranno } = useTransadjust();
  const addTransadjust = useAddTransadjust();
  const deleteTransadjust = useDeleteTransadjust();
  const updateTransadjust = useUpdateTransadjust();
  const { transadjustdetls, setBatchnoNo } = useTransadjustDetls();
  const addTransadjustDetls = useAddTransAdjustDetls();
  const deleteTransadjustDetls = useDeleteTransAdjustDetls();

  const { itemshistory, setItemhistItemno } = useItemsHistory();
  const deleteItemsHistory = useDeleteItemsHistory();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [invoice, setInvoice] = useRecoilState(tranadjustState);
  const [invoicedetls, setInvoicedetls] = useRecoilState(tranadjustdetlsState);
  const [editInvoiceId, setEditInvoiceId] = useRecoilState(
    editTranadjustIdState
  );
  const [editInvoicedetlsId, setEditInvoicedetlsId] = useRecoilState(
    editTranadjustDetlsIdState
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isTranOpen,
    onOpen: onTranOpen,
    onClose: onTranClose,
  } = useDisclosure();

  const title = `Adjustment Transactions`;

  const columns = useMemo(
    () => [
      {
        header: 'Batch No',
        accessorKey: 'ta_batchno',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        id: 'date',
        header: 'Batch Date',
        accessorFn: row => {
          const tDay = new Date(row.ta_date);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),
        size: 200,
        filterVariant: 'date',
        sortingFn: 'datetime',
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Remark',
        accessorKey: 'ta_remark',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Status',
        accessorFn: row => {
          switch (row.ta_post) {
            case '0':
              return <div>Open</div>;
            case '1':
              return <div>Posted</div>;
            case 'D':
              return <div>Deleted</div>;
            default:
              return null;
          }
        },
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    const { ta_batchno } = state;
    deleteTransadjust(state);
    deleteTransadjustDetls({ tad_batchno: ta_batchno, tad_branch: branch });
    //deleteItemsHistory({ it_transno: t_no });
  };

  const handleAddTran = () => {
    setEditInvoiceId(
      prev => (prev = { id: '', batchno: '', layout: 'Item', status: 'add' })
    );
    setInvoice(prev => (prev = { ...initial_tran }));
    setInvoicedetls(
      prev => (prev = transadjustdetls.filter(r => r.ta_batchno === ''))
    );
    navigate('/transadjustform');
  };

  const handleEditTran = row => {
    const { original } = row;
    const { ta_id, ta_batchno } = original;
    setEditInvoiceId(
      prev => (prev = { id: ta_id, no: ta_batchno, status: 'edit' })
    );
    setInvoice(prev => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId(
      prev => (prev = { ...prev, id: ta_id, no: ta_batchno })
    );
    setInvoicedetls(prev =>
      transadjustdetls.filter(r => r.tad_batchno === ta_batchno)
    );

    navigate('/transadjustform');
  };

  const handleDeleteTran = row => {
    const { original } = row;
    const { ta_post } = original;
    if (ta_post !== '0') {
      Toast({
        title: 'This transaction can not be deleted!',
        status: 'warning',
        customId: 'transadjustDelErr',
      });
    } else {
      setState(prev => (prev = { ...original }));
      onAlertDeleteOpen();
    }
  };

  const add_Tran = data => {
    addTransadjust(data);
  };

  const update_Tran = data => {
    updateTransadjust(data);
    onTranClose();
  };

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderRadius={15}
        borderColor="teal.800"
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={transadjust}
          initialState={{ sorting: [{ id: 'date', desc: true }] }}
          handleAdd={handleAddTran}
          handleEdit={handleEditTran}
          handleDelete={handleDeleteTran}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isTranOpen}
        onClose={onTranClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <TransAdjustForm
              state={state}
              setState={setState}
              add_Purchase={add_Tran}
              update_Purchase={update_Tran}
              statustype={statustype}
              onPOClose={onTranClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Transaction"
      >
        <Heading size="md">
          Are you sure you want to delete this transaction {state.ta_batchno} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default TransTable;
