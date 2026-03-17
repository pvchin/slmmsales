import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import currency from 'currency.js';
import {
  Box,
  Flex,
  Heading,
  Icon,
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
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
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
//import { usePayable } from '../react-query/payable/usePayable';

const PaymentDetlsTableNew = ({
  batchdetlsstate,
  setBatchDetlsState,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
}) => {
  //const navigate = useNavigate();
  //const { payable, setAPSuppno } = usePayable();
  //const [batchdetls, setBatchDetls] = useState();
  //const [state, setState] = useState({});
  //const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = useState('');
  const [editBatchId, setEditBatchId] = useRecoilState(editPaymentIdState);
  const [suppno, setSuppno] = useState('');
  
  console.log('batchdetls inside', batchdetlsstate);

  const filteredData = batchdetlsstate.filter(
    item =>
      item.ap_invno &&
      item.ap_invno.toLowerCase().includes(filterText.toLowerCase())
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

  const titles = 'New Payment Details Table';

  const columns = [
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
      name: 'Inv Amount',
      selector: row => row.payd_invamt,
      width: '150px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_invamt).format()}</div>,
    },
    {
      id: 8,
      name: 'Last Balance',
      selector: row => row.payd_last_bal,
      width: '150px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_last_bal).format()}</div>,
    },
    {
      id: 9,
      name: 'Discount',
      selector: row => row.payd_disc,
      width: '150px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_disc).format()}</div>,
    },
    {
      id: 10,
      name: 'Payment',
      selector: row => row.payd_amt,
      width: '150px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.payd_amt).format()}</div>,
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
          filterbyname="filter by item description"
          defaultSortFieldId="5"
          defaultSortAsc={true}
          hideAddRec
        />
      </Box>
    </Flex>
  );
};

export default PaymentDetlsTableNew;
