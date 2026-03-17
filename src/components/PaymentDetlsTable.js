import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import currency from 'currency.js';
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
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomDataTable from '../helpers/CustomDataTable';
import { useRecoilState } from 'recoil';
import {
  paymentState,
  paymentdetlsState,
  editPaymentIdState,
  editPaymentDetlsIdState,
} from '../data/atomdata';
import { usePaymentsDetls } from '../react-query/purchasesdetls/usePurchasesDetls';

const PaymentDetlsTable = ({
  batchdetlsstate,
  setBatchDetlsState,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
}) => {
  //const navigate = useNavigate();
  //const { samplesbatchdetls, setBatchDetlsId } = useSamplesBatchDetls();
  //const [batchdetls, setBatchDetls] = useState();
  //const [state, setState] = useState({});
  //const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = useState('');
  const [editBatchId, setEditBatchId] = useRecoilState(editPaymentIdState);
  
  // const [singleSampleBatch, setSingleSampleBatch] = useRecoilState(
  //   singleSampleBatchState
  // );
  // const [singleSampleBatchDetls, setSingleSampleBatchDetls] = useRecoilState(
  //   singleSampleBatchDetlsState
  // );

  console.log('editbatch ', editBatchId);

  const filteredData = batchdetlsstate.filter(
    item =>
      item.payd_invno &&
      item.payd_invno.toLowerCase().includes(filterText.toLowerCase())
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isBatchDetlsOpen,
    onOpen: onBatchDetlsOpen,
    onClose: onBatchDetlsClose,
  } = useDisclosure();

  const titles = 'Payment Details Table';

  const columns = [
    {
      id: 1,
      key: 'editaction',
      text: 'Action',
      sortable: false,
      width: '60px',
      omit: editBatchId.status === 'edit',
      cell: record => {
        return (
          <>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              onClick={() => {
                handleEditBatchDetls(record);
              }}
            ></IconButton>
          </>
        );
      },
    },
    {
      id: 2,
      key: 'deleteaction',
      text: 'Action',
      width: '60px',
      sortable: false,
      omit: editBatchId.status === 'edit',
      cell: record => {
        return (
          <>
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              onClick={() => {
                handleDeleteBatchDetls(record);
              }}
            />
          </>
        );
      },
    },

    {
      id: 3,
      name: 'Invoice No',
      selector: row => row.payd_invno || ' ',
      sortable: true,
      width: '150px',
      filterable: true,
    },
    {
      id: 4,
      name: 'Inv Date',
      selector: row => row.payd_invdate,
      width: '120px',
      sortable: true,
      cell: row => (
        <div>{format(new Date(row.payd_invdate), 'dd/MM/yyyy')}</div>
      ),
    },
    {
      id: 5,
      name: 'PO No',
      selector: row => row.payd_pono || ' ',
      sortable: true,
      width: '150px',
      filterable: true,
    },
    {
      id: 6,
      name: 'PO Date',
      selector: row => row.payd_podate,
      width: '120px',
      sortable: true,
      cell: row => <div>{format(new Date(row.payd_podate), 'dd/MM/yyyy')}</div>,
    },
    {
      id: 7,
      name: 'Amount',
      selector: row => row.payd_invamt,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_invamt).format()}</div>,
    },
    {
      id: 8,
      name: 'Last Bal',
      selector: row => row.payd_last_bal,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_last_bal).format()}</div>,
    },
    {
      id: 9,
      name: 'Discount',
      selector: row => row.payd_disc,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_disc).format()}</div>,
    },
    {
      id: 10,
      name: 'Payment',
      selector: row => row.payd_amt,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_amt).format()}</div>,
    },
    {
      id: 11,
      name: 'Due',
      selector: row => row.payd_due,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => (
        <div>{currency(row.payd_last_bal - row.payd_amt).format()}</div>
      ),
    },
  ];

  const columns_others = [
    {
      id: 1,
      key: 'editaction',
      text: 'Action',
      sortable: false,
      width: '60px',
      cell: record => {
        return (
          <>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              onClick={() => {
                handleEditBatchDetls(record);
              }}
            ></IconButton>
          </>
        );
      },
    },
    {
      id: 2,
      key: 'deleteaction',
      text: 'Action',
      width: '60px',
      sortable: false,
      cell: record => {
        return (
          <>
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              onClick={() => {
                handleDeleteBatchDetls(record);
              }}
            />
          </>
        );
      },
    },

    {
      id: 5,
      name: 'Description',
      selector: row => row.pl_desp,
      //minWidth: '200px',
      sortable: true,
      filterable: true,
      align: 'left',
      wrap: false,
      cell: row => (
        <div style={{ overflow: 'hidden', textAlign: 'left' }}>
          {row.pl_desp}
        </div>
      ),
    },

    {
      id: 10,
      name: 'Amount',
      selector: row => row.pl_excost || 0,
      width: '200px',
      sortable: true,
      filterable: true,
    },
  ];

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="auto"
      >
        <CustomDataTable
          title={titles}
          columns={columns}
          filteredData={filteredData}
          handleAddRec={handleAddBatchDetls}
          filterText={filterText}
          setFilterText={setFilterText}
          filterbyname="filter by invoice no"
          defaultSortFieldId="5"
          defaultSortAsc={true}
          hideAddRec
        />
      </Box>
    </Flex>
  );
};

export default PaymentDetlsTable;
