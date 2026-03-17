import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { format } from 'date-fns';
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
  receiptState,
  receiptdetlsState,
  editReceiptIdState,
  editReceiptDetlsIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { useNavigate } from 'react-router-dom';
import CustomDataTable from '../helpers/CustomDataTable';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useReceipts } from '../react-query/receipts/useReceipts';
import { useAddReceipt } from '../react-query/receipts/useAddReceipt';
import { useUpdateReceipt } from '../react-query/receipts/useUpdateReceipt';
import { useDeleteReceipt } from '../react-query/receipts/useDeleteReceipt';
import { useReceiptsDetls } from '../react-query/receiptsdetls/useReceiptsDetls';
import { branch } from '../utils/constants';
import CustomReactTable from '../helpers/CustomReactTable';
import ReceiptForm from './ReceiptForm';

const initial_receipt = {
  rcp_id: '',
  rcp_no: '',
  rcp_date: dayjs().format('YYYY-MM-DD'),
  rcp_bank: '',
  rcp_refno: '',
  rcp_remark: '',
  rcp_custno: '',
  rcp_customer: '',
  rcp_total: 0,
  rcp_disc: 0,
  rcp_nettotal: 0,
  rcp_post: '0',
  rcp_branch: branch,
};

const ReceiptsTable = () => {
  const navigate = useNavigate();
  const { receipts, setRcpCustno } = useReceipts();
  const addReceipt = useAddReceipt();
  const deleteReceipt = useDeleteReceipt();
  const updateReceipt = useUpdateReceipt();
  const { receiptsdetls, setReptno } = useReceiptsDetls();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [invoice, setInvoice] = useRecoilState(receiptState);
  const [invoicedetls, setInvoicedetls] = useRecoilState(receiptdetlsState);
  const [editInvoiceId, setEditInvoiceId] = useRecoilState(editReceiptIdState);
  const [editInvoicedetlsId, setEditInvoicedetlsId] = useRecoilState(
    editReceiptDetlsIdState
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const filteredData = receipts.filter(
    item =>
      item.rcp_no &&
      item.rcp_no.toLowerCase().includes(filterText.toLowerCase())
  );

  const title = 'Receipts';

  const columns = useMemo(
    () => [
      {
        header: 'Receipt No',
        accessorFn: row => row.rcp_no,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Receipt Date',
        accessorFn: row => row.rcp_date,
        //size: 200,
        Cell: ({ cell }) => (
          <div>{format(new Date(cell.rcp_date), 'dd/MM/yyyy')}</div>
        ),
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Cust No',
        accessorFn: row => row.rcp_custno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Customer',
        accessorFn: row => row.rcp_customer,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.rcp_nettotal,
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
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteReceipt(state);
  };

  const handleAddReceipt = () => {
    setEditInvoiceId(prev => (prev = { id: '', batchno: '', status: 'add' }));
    setInvoice(prev => (prev = { ...initial_receipt }));
    setInvoicedetls(
      prev => (prev = receiptsdetls.filter(r => r.rcpd_no === ''))
    );
    navigate('/receiptform');
  };

  const handleEditReceipt = row => {
    const { original } = row;
    const { rcp_id, rcp_no } = original;
    setReptno(prev => (prev = rcp_no));
    setEditInvoiceId(
      prev => (prev = { id: rcp_id, no: rcp_no, status: 'edit' })
    );
    setInvoice(prev => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId(prev => (prev = { ...prev, id: rcp_id, no: rcp_no }));
    setInvoicedetls(
      prev => (prev = receiptsdetls.filter(r => r.rcpd_no === rcp_no))
    );
    navigate('/receiptform');
  };

  const handleDeleteReceipt = row => {
    const { original } = row;
    setState(prev => (prev = { ...original }));
    onAlertDeleteOpen();
  };

  const add_Receipt = data => {
    addReceipt(data);
  };

  const update_Receipt = data => {
    updateReceipt(data);
    onFormClose();
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
          data={receipts}
          handleAdd={handleAddReceipt}
          handleEdit={handleEditReceipt}
          handleDelete={handleDeleteReceipt}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isFormOpen}
        onClose={onFormClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <ReceiptForm
              state={state}
              setState={setState}
              add_Receipt={add_Receipt}
              update_Receipt={update_Receipt}
              statustype={statustype}
              onFormClose={onFormClose}
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
        title="Delete Receipt"
      >
        <Heading size="md">
          Are you sure you want to delete this purchase {state.po_no}{' '}
          {state.po_supplier} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default ReceiptsTable;
