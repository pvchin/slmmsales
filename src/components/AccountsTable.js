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
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomDataTable from '../helpers/CustomDataTable';
import { useAccounts } from '../react-query/accounts/useAccounts';
import { useAddAccount } from '../react-query/accounts/useAddAccount';
import { useUpdateAccount } from '../react-query/accounts/useUpdateAccount';
import { useDeleteAccount } from '../react-query/accounts/useDeleteAccount';
import CustomReactTable from '../helpers/CustomReactTable';
import AccountForm from './AccountForm';

const initial_acc = {
  acc_code: '',
  acc_name: '',
  acc_cat: '',
  acc_type: '',
  acc_last_year: 0,
  acc_temp_bal: 0,
  acc_groupitem: false,
  acc_class: '',
  acc_branch: branch,
};

const AccountsTable = () => {
  const { accounts } = useAccounts();
  const addAccount = useAddAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isAccOpen,
    onOpen: onAccOpen,
    onClose: onAccClose,
  } = useDisclosure();

  const title = 'Accounts';

  const columns = useMemo(
    () => [
      {
        header: 'GL Code',
        accessorFn: row => row.acc_code,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'GL Name',
        accessorFn: row => row.acc_name,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Category',
        accessorFn: row => row.acc_cat,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Type',
        accessorFn: row => row.acc_type,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteAccount(state);
  };

  const handleAddAcc = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_acc };
    setState(data);
    onAccOpen();
  };

  const handleEditAcc = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setState(prev => original);
    onAccOpen();
  };

  const handleDeleteAcc = row => {
    const { original } = row;
    setState(prev => original);
    onAlertDeleteOpen();
  };

  const add_Acc = data => {
    addAccount(data);
  };

  const update_Acc = data => {
    updateAccount(data);
    onAccClose();
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
          data={accounts}
          handleAdd={handleAddAcc}
          handleEdit={handleEditAcc}
          handleDelete={handleDeleteAcc}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isAccOpen}
        onClose={onAccClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <AccountForm
              state={state}
              setState={setState}
              add_Acc={add_Acc}
              update_Acc={update_Acc}
              statustype={statustype}
              onAccClose={onAccClose}
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
        title="Delete Account"
      >
        <Heading size="md">
          Are you sure you want to delete this account {state.acc_code} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default AccountsTable;
