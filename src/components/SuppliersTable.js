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
//import { BiEditAlt } from 'react-icons/bi';
//import { MdDelete } from 'react-icons/md';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomDataTable from '../helpers/CustomDataTable';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useAddSupplier } from '../react-query/suppliers/useAddSupplier';
import { useUpdateSupplier } from '../react-query/suppliers/useUpdateSupplier';
import { useDeleteSupplier } from '../react-query/suppliers/useDeleteSupplier';
import CustomReactTable from '../helpers/CustomReactTable';
import SupplierForm from './SupplierForm';

const initial_cust = {
  s_suppno: '',
  s_supp: '',
  s_add1: '',
  s_add2: '',
  s_add3: '',
  s_add4: '',
  s_phone: '',
  s_email: '',
  s_fax: '',
  s_contact: '',
  s_crlimit: 0,
  s_terms: 0,
  s_glcode: '',
  s_branch: '',
  s_bankname: '',
  s_bankacno: '',
};

const SuppliersTable = () => {
  const { suppliers } = useSuppliers();
  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');

  const filteredData = suppliers.filter(
    item =>
      item.s_supp &&
      item.s_supp.toLowerCase().includes(filterText.toLowerCase())
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isSuppOpen,
    onOpen: onSuppOpen,
    onClose: onSuppClose,
  } = useDisclosure();

  const title = 'Suppliers';

  const columns = useMemo(
    () => [
      {
        header: 'Supplier No',
        accessorFn: row => row.s_suppno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Supplier',
        accessorFn: row => row.s_supp,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Phone',
        accessorFn: row => row.s_phone,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Email',
        accessorFn: row => row.s_email,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Fax',
        accessorFn: row => row.s_fax,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Contact',
        accessorFn: row => row.s_contact,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteSupplier(state);
  };

  const handleAddSupp = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_cust };
    setState(data);
    onSuppOpen(true);
  };

  const handleEditSupp = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setState(prev => original);
    onSuppOpen(true);
  };

  const handleDeleteSupp = row => {
    const { original } = row;
    setState(prev => original);
    onAlertDeleteOpen();
  };

  const add_Supp = data => {
    addSupplier(data);
  };

  const update_Supp = data => {
    updateSupplier(data);
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
          data={suppliers}
          handleAdd={handleAddSupp}
          handleEdit={handleEditSupp}
          handleDelete={handleDeleteSupp}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSuppOpen}
        onClose={onSuppClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <SupplierForm
              state={state}
              setState={setState}
              add_Supp={add_Supp}
              update_Supp={update_Supp}
              statustype={statustype}
              onSuppClose={onSuppClose}
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
        title="Delete Supplier"
      >
        <Heading size="md">
          Are you sure you want to delete this supplier {state.s_suppno}{' '}
          {state.s_supp} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default SuppliersTable;
