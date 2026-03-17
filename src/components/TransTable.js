import React, { useState, useMemo } from 'react';
import currency from 'currency.js';
import { branch } from '../utils/constants';
import { useCustomToast } from '../helpers/useCustomToast';
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
  tranState,
  trandetlsState,
  editTranIdState,
  editTranDetlsIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomReactTable from '../helpers/CustomReactTable';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useTrans } from '../react-query/trans/useTrans';
import { useAddTran } from '../react-query/trans/useAddTran';
import { useDeleteTran } from '../react-query/trans/useDeleteTran';
import { useUpdateTran } from '../react-query/trans/useUpdateTran';
import { useTransDetls } from '../react-query/transdetls/useTranDetls';
import { useDeleteTranDetls } from '../react-query/transdetls/useDeleteTranDetls';
import { useItemsHistory } from '../react-query/itemshistory/useItemsHistory';
import { useDeleteItemsHistory } from '../react-query/itemshistory/useDeteteItemsHistory';
import TranForm from './TransForm';

const initial_tran = {
  t_no: '',
  t_date: dayjs().format('YYYY-MM-DD'),
  t_type: '',
  t_docno: '',
  t_docdate: dayjs().format('YYYY-MM-DD'),
  t_scno: '',
  t_sc: '',
  t_add1: '',
  t_add2: '',
  t_add3: '',
  t_add4: '',
  t_term: '',
  t_branch: branch,
  t_remark: '',
  t_post: '0',
  t_print: '',
  t_subtotal: 0,
  t_disc: 0,
  t_nettotal: 0,
  t_layout: 'Item',
  t_postdate: dayjs().format('YYYY-MM-DD'),
  t_glcode: '',
  t_recdate: dayjs().format('YYYY-MM-DD'),
  t_createdby: '',
  t_updby: '',
  t_createddate: dayjs().format('YYYY-MM-DD'),
  t_createdtime: '',
  t_upddate: dayjs().format('YYYY-MM-DD'),
  t_updtime: '',
  t_dono: '',
  t_dodate: dayjs().format('YYYY-MM-DD'),
  t_name: '',
  t_section: '',
};

const TransTable = () => {
  const navigate = useNavigate();
  const toast = useCustomToast();
  const { trans, setTranno } = useTrans();
  const addTran = useAddTran();
  const deleteTran = useDeleteTran();
  const updateTran = useUpdateTran();
  const { transdetls, setTranNo } = useTransDetls();
  const deleteTranDetls = useDeleteTranDetls();
  const { itemshistory, setItemhistItemno } = useItemsHistory();
  const deleteItemsHistory = useDeleteItemsHistory();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [invoice, setInvoice] = useRecoilState(tranState);
  const [invoicedetls, setInvoicedetls] = useRecoilState(trandetlsState);
  const [editInvoiceId, setEditInvoiceId] = useRecoilState(editTranIdState);
  const [editInvoicedetlsId, setEditInvoicedetlsId] =
    useRecoilState(editTranDetlsIdState);

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

  const title = `Transactions`;

  const columns = useMemo(
    () => [
      {
        header: 'Batch No',
        accessorKey: 't_no',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        id: 'date',
        header: 'Tran Date',
        accessorFn: row => {
          const tDay = new Date(row.t_date);
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
        header: 'Tran No',
        accessorFn: row => row.t_docno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Type',
        accessorFn: row => row.t_type,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.t_nettotal,
        //size: 200,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'From/To',
        accessorFn: row => row.t_sc,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      /*    {
      id: 10,
      name: 'Amount',
      selector: row => row.t_nettotal,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.t_nettotal).format()}</div>,
    }, */
      {
        header: 'Status',
        accessorFn: row => {
          switch (row.t_post) {
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
    const { t_no } = state;
    deleteTran(state);
    deleteTranDetls({ tl_tranno: t_no, tl_branch: branch });
    //deleteItemsHistory({ it_transno: t_no });
  };

  const handleAddTran = () => {
    setEditInvoiceId(
      prev => (prev = { id: '', batchno: '', layout: 'Item', status: 'add' })
    );
    setInvoice(prev => (prev = { ...initial_tran }));
    setInvoicedetls(
      prev => (prev = transdetls.filter(r => r.tl_tranno === ''))
    );
    navigate('/transform');
  };

  const handleEditTran = row => {
    const { original } = row;
    const { t_id, t_no, t_layout } = original;
    setEditInvoiceId(
      prev => (prev = { id: t_id, no: t_no, layout: t_layout, status: 'edit' })
    );
    setInvoice(prev => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId(prev => (prev = { ...prev, id: t_id, no: t_no }));
    setInvoicedetls(prev => transdetls.filter(r => r.tl_tranno === t_no));

    navigate('/transform');
  };

  const handleDeleteTran = row => {
    const { original } = row;
    const { t_post } = original;
    if (t_post !== '0') {
      toast({
        title: 'This transaction can not be deleted!',
        status: 'warning',
      });
    } else {
      setState(prev => (prev = { ...original }));
      onAlertDeleteOpen();
    }
  };

  const add_Tran = data => {
    addTran(data);
  };

  const update_Tran = data => {
    updateTran(data);
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
          data={trans}
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
            <TranForm
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
          Are you sure you want to delete this transaction {state.t_no} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default TransTable;
