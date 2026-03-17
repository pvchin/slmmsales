import React, { useMemo } from 'react';

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
import CustomDataTable from '../helpers/CustomDataTable';
import { useRecoilState } from 'recoil';
import { searchitemState } from '../data/atomdata';
import { useAccounts } from '../react-query/accounts/useAccounts';
import CustomReactTable from '../helpers/CustomReactTable';

const initial_cust = {
  c_custno: '',
  c_cust: '',
  c_add1: '',
  c_add2: '',
  c_add3: '',
  c_add4: '',
  c_phone: '',
  c_email: '',
  c_fax: '',
  c_contact: '',
  c_area: '',
};

const AccountSearchTable = ({ update_Item, onAccountSearchClose }) => {
  const { accounts } = useAccounts();
  const [filterText, setFilterText] = React.useState('');
  const [searchitem, setSearchItem] = useRecoilState(searchitemState);
  const title = 'GL Search';

  const columns = useMemo(
    () => [
      {
        header: 'GL Code',
        accessorFn: row => row.acc_code,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'GL Name',
        accessorFn: row => row.acc_name,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Category',
        accessorFn: row => row.acc_cat,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Type',
        accessorFn: row => row.acc_type,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleRowDoubleClick = row => {
    const { original } = row;
    setSearchItem(prev => (prev = original));
    update_Item(original);
    onAccountSearchClose();
  };

  const handleSelectRow = row => {
    const { original } = row;
    setSearchItem(prev => (prev = original));
    update_Item(original);
    onAccountSearchClose();
  };

  return (
    <Flex>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="scroll"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={accounts.filter(r => r.acc_type === 'DETAIL ACCOUNT')}
          disableExportStatus={true}
          disableRowActionStatus={true}
          disableAddStatus={true}
          //handleAdd={handleAddEquip}
          //handleEdit={handleEditEquip}
          //handleDelete={handleDeleteEquip}
          handleSelect={handleSelectRow}
          handleRowDoubleClick={handleRowDoubleClick}
        />
      </Box>
    </Flex>
  );
};

export default AccountSearchTable;
