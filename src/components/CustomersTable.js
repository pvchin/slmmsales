import React, { useState, useMemo } from 'react';

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
//import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
//import { BiEditAlt } from 'react-icons/bi';
//import { MdDelete } from 'react-icons/md';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomDataTable from '../helpers/CustomDataTable';
import { useCustomers } from '../react-query/customers/useCustomers';
import { useAddCustomer } from '../react-query/customers/useAddCustomer';
import { useUpdateCustomer } from '../react-query/customers/useUpdateCustomer';
import { useDeleteCustomer } from '../react-query/customers/useDeleteCustomer';
import CustomReactTable from '../helpers/CustomReactTable';
import CustomerForm from './CustomerForm';

const initial_cust = {
  c_custno: '',
  c_cust: '',
  c_add1: '',
  c_add2: '',
  c_add3: '',
  c_add4: '',
  c_phone: '',
  c_fax: '',
  c_email: '',
  c_crlimit: 0,
  c_terms: 0,
  c_contact: '',
  c_post: '',
  c_isbranch: false,
  c_glcode: '',
  c_branch: '',
  c_isposmember: false,
  c_area: '',
};

const CustomersTable = () => {
  const { customers } = useCustomers();
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  console.log('cust', customers);
  const filteredData = customers.filter(
    item =>
      item.c_cust &&
      item.c_cust.toLowerCase().includes(filterText.toLowerCase())
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isCustOpen,
    onOpen: onCustOpen,
    onClose: onCustClose,
  } = useDisclosure();

  const title = 'Customers';

  const columns = useMemo(
    () => [
      {
        header: 'Cust No',
        accessorFn: row => row.c_custno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Customer',
        accessorFn: row => row.c_cust,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Phone',
        accessorFn: row => row.c_phone,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Email',
        accessorFn: row => row.c_email,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Fax',
        accessorFn: row => row.c_fax,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Contact',
        accessorFn: row => row.c_contact,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Area',
        accessorFn: row => row.c_area,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Salesman',
        accessorFn: row => row.c_smno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteCustomer(state);
  };

  const handleAddCust = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_cust };
    setState(data);
    onCustOpen();
  };

  const handleEditCust = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setState(prev => original);
    onCustOpen();
  };

  const handleDeleteCust = row => {
    const { original } = row;
    setState(prev => original);
    onAlertDeleteOpen();
  };

  const add_Cust = data => {
    addCustomer(data);
  };

  const update_Cust = data => {
    updateCustomer(data);
    onCustClose();
  };

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={15}
        overflow="scroll"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={customers}
          handleAdd={handleAddCust}
          handleEdit={handleEditCust}
          handleDelete={handleDeleteCust}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isCustOpen}
        onClose={onCustClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <CustomerForm
              state={state}
              setState={setState}
              add_Cust={add_Cust}
              update_Cust={update_Cust}
              statustype={statustype}
              onCustClose={onCustClose}
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
        title="Delete Customer"
      >
        <Heading size="md">
          Are you sure you want to delete this customer {state.c_cust}{' '}
          {state.ar_cust} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default CustomersTable;
