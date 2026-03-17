import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import currency from 'currency.js';
import dayjs from 'dayjs';
import { useCustomToast } from '../helpers/useCustomToast';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Wrap,
  WrapItem,
  useRadio,
  useRadioGroup,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  IconArrowBackUp,
  IconPrinter,
  IconSearch,
  IconDeviceFloppy,
  IconDoorExit,
  IconPlus,
  IconSend,
  IconSquare,
  IconSquareCheck,
} from '@tabler/icons-react';
//import { FiSave } from 'react-icons/fi';
//import { SearchIcon } from '@chakra-ui/icons';
//import { TiArrowBack } from 'react-icons/ti';
//import { ImExit } from 'react-icons/im';
// import {
//   MdOutlineCheckBox,
//   MdOutlineCheckBoxOutlineBlank,
// } from 'react-icons/md';
//import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { useRecoilState } from 'recoil';
import { usePayable } from '../react-query/payable/usePayable';
import CustomDataTable from '../helpers/CustomDataTable';
import CustomReactTable from '../helpers/CustomReactTable';
import SupplierSearchTable from './SupplierSearchTable';

const initial_item = [
  {
    s_suppno: '',
    s_supp: '',
    s_branch: '',
    s_paid: '',
  },
];

const SupplierStatementTable = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [state, setState] = useState(initial_item);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [selectedsuppno, setSelectedSuppno] = useState('');
  const [paid, setPaid] = useState('');
  const { payable, setAPSuppno } = usePayable();
  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const filteredData = payable.filter(
    item =>
      item.ap_invno &&
      item.ap_invno.toLowerCase().includes(filterText.toLowerCase())
  );
  console.log('ap', payable);

  const {
    isOpen: isSuppSearchOpen,
    onOpen: onSuppSearchOpen,
    onClose: onSuppSearchClose,
  } = useDisclosure();

  const title = 'Supplier Statement';

  const columns = useMemo(
    () => [
      {
        header: 'Invoice No',
        accessorFn: row => row.ap_invno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'PO No',
        accessorFn: row => row.ap_pono,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Inv Date',
        accessorFn: row => row.ap_invdate,
        //size: 200,
        /*  Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'), */
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'PO Date',
        accessorFn: row => row.ap_podate,
        //size: 200,
        /*   Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'), */
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Type',
        accessorFn: row => row.ap_type,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Supp No',
        accessorFn: row => row.ap_suppno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Supplier',
        accessorFn: row => row.ap_supplier,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.ap_nettotal_amt,
        //size: 200,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Paid',
        accessorFn: row => {
          return row.ap_paid ? (
            <Icon as={IconSquareCheck} w={7} h={7} />
          ) : (
            <Icon as={IconSquare} w={7} h={7} />
          );
        },
        size: 120,
        mantineTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        header: 'Branch',
        accessorFn: row => row.ap_branch,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleExit = () => {
    navigate(-1);
  };

  const handleSuppSearch = () => {
    onSuppSearchOpen();
  };

  const update_SuppDetls = data => {
    const { s_suppno, s_supp } = data;
    setSelectedSuppno(prev => (prev = s_suppno));

    // update state values
    setValue('s_suppno', s_suppno);
    setValue('s_supp', s_supp);
  };

  /*  useEffect(() => {
    setAPSuppno(selectedsuppno);
  }, [selectedsuppno]); */

  // useEffect(() => {
  //   console.log('paid', paid);
  // }, [paid]);

  return (
    <Box
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //align="left"
        //alignItems="flex-start"
      >
        <form>
          <HStack py={2} spacing="3">
            <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
              <GridItem colSpan={1}>
                <Button
                  leftIcon={<IconArrowBackUp size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={8}>
                <Center>
                  <Heading size="lg">Supplier Statement</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={2}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup spacing={8}>
                      <Button
                        leftIcon={<IconDeviceFloppy size="20" />}
                        colorScheme="teal"
                        //type="submit"
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<IconDoorExit />}
                        colorScheme="teal"
                        onClick={handleExit}
                      >
                        Exit
                      </Button>
                    </ButtonGroup>
                  </HStack>
                </Flex>
              </GridItem>
            </Grid>
          </HStack>
          <Grid
            templateColumns={'repeat(12,1fr)'}
            //templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid teal"
            borderRadius="20"
            backgroundColor="blue.50"
          >
            <GridItem colSpan={2} mt={field_gap} w="100%">
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="s_suppno"
                    //defaultValue={invoice.sls_no || ''}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          Supplier No
                        </Text>
                        <Input
                          name="s_suppno"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="supplier no"
                          minWidth="100"
                          readOnly
                        />
                      </VStack>
                    )}
                  />
                </FormControl>
                <Box pt={7}>
                  <IconButton
                    onClick={() => handleSuppSearch()}
                    icon={<IconSearch />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={5} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_supp"
                  defaultValue={state.s_supp}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      {/* <FormLabel>Description</FormLabel> */}
                      <Text as="b" fontSize="sm" textAlign="left">
                        Supplier
                      </Text>
                      <Input
                        name="s_supp"
                        value={value}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="supplier name"
                        readOnly
                        //minWidth="100"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_paid"
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      {/* <FormLabel>Description</FormLabel> */}
                      <Text as="b" fontSize="sm" textAlign="left">
                        Payment Status
                      </Text>
                      <RadioGroup
                        name="s_paid"
                        value={value}
                        defaultValue="0"
                        width="full"
                        height="10"
                        padding="1"
                        onChange={setPaid}
                        borderColor="gray.400"
                        borderWidth="1px"
                        //textTransform="capitalize"
                        ref={ref}
                      >
                        <Stack direction="row">
                          <Radio value="0">All</Radio>
                          <Radio value="1">Paid</Radio>
                          <Radio value="2">UnPaid</Radio>
                        </Stack>
                      </RadioGroup>
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Box
            width="100%"
            borderWidth={1}
            borderColor="teal.800"
            borderRadius={10}
            border="1px solid teal"
            backgroundColor="white"
            overflow="scroll"
            px={5}
            mt={5}
          >
            <CustomReactTable
              title={title}
              columns={columns}
              data={payable}
              /*   data={payable.filter(item => {
                switch (paid) {
                  case '0':
                    return item.ap_paid === true || item.ap_paid === false;
                  case '1':
                    return item.ap_paid === true;
                  case '2':
                    return item.ap_paid === false;
                  default:
                    return item.ap_paid === true || item.ap_paid === false;
                }
              })} */
              disableExportStatus={true}
              disableRowActionStatus={true}
              disableAddStatus={true}
              disableEditStatus={true}
              //handleAdd={handleAddEquip}
              //handleEdit={handleEditEquip}
              //handleDelete={handleDeleteEquip}
            />
          </Box>
        </form>
      </VStack>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSuppSearchOpen}
        onClose={onSuppSearchClose}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <SupplierSearchTable
              state={state}
              setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_SuppDetls}
              statustype={statustype}
              setStatusType={setStatusType}
              onSupplierSearchClose={onSuppSearchClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SupplierStatementTable;
