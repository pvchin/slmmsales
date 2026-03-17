import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { format } from 'date-fns';
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
import { useRecoilState } from 'recoil';
import { arStatementState, arStatementDetlsState } from '../data/atomdata';
//import { SearchIcon } from '@chakra-ui/icons';
//import { TiArrowBack, TiPrinter } from 'react-icons/ti';
//import { ImExit } from 'react-icons/im';
//import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { useReceivable } from '../react-query/receivable/useReceivable';
import CustomDataTable from '../helpers/CustomDataTable';
import CustomReactTable from '../helpers/CustomReactTable';
import CustomerSearchTable from './CustomerSearchTable';

const initial_item = [
  {
    ar_custno: '',
    ar_cust: '',
    ar_branch: '',
    ar_paid: '',
    ar_add1: '',
    ar_add2: '',
    ar_add3: '',
    ar_add4: '',
  },
];

const CustomerStatementTable = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [batch, setBatch] = useRecoilState(arStatementState);
  const [batchdetls, setBatchdetls] = useRecoilState(arStatementDetlsState);
  const [state, setState] = useState(initial_item);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [selectedcustno, setSelectedCustno] = useState('');
  const [paid, setPaid] = useState('');
  const { receivable, setARCustno } = useReceivable();
  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const filteredData = receivable.filter(
    item =>
      item.ar_invno &&
      item.ar_invno.toLowerCase().includes(filterText.toLowerCase())
  );
  console.log('receivable', filteredData);

  const {
    isOpen: isCustSearchOpen,
    onOpen: onCustSearchOpen,
    onClose: onCustSearchClose,
  } = useDisclosure();

  const title = 'Customer Statement';

  const columns = useMemo(
    () => [
      {
        header: 'Invoice No',
        accessorFn: row => row.ar_invno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Date',
        accessorFn: row => row.ar_date,
        size: 120,
        /*  Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'), */
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Cust No',
        accessorFn: row => row.ar_custno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Customer',
        accessorFn: row => row.ar_cust,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Type',
        accessorFn: row => row.ar_type,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.ar_total,
        size: 120,
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
        header: 'Balance',
        accessorFn: row => row.ar_balance,
        size: 120,
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
        header: 'Paid',
        accessorFn: row => {
          return row.ar_paid ? (
            <Icon as={IconSquareCheck} w={6} h={6} />
          ) : (
            <Icon as={IconSquare} w={6} h={6} />
          );
        },
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Branch',
        accessorFn: row => row.ar_branch,
        size: 120,
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

  const handleCustSearch = () => {
    onCustSearchOpen();
  };

  const update_CustDetls = data => {
    const { c_custno, c_cust, c_add1, c_add2, c_add3, c_add4 } = data;
    setSelectedCustno(prev => (prev = c_custno));
    // update state values
    setValue('ar_custno', c_custno);
    setValue('ar_cust', c_cust);
    setValue('ar_cust', c_cust);
    setValue('ar_add1', c_add1);
    setValue('ar_add2', c_add2);
    setValue('ar_add3', c_add3);
    setValue('ar_add4', c_add4);
  };

  const handlePrint = () => {
    const data = getValues();
    //console.log('print', data);
    //console.log('print detls', receivable)
    setBatch(prev => (prev = { ...data }));
    setBatchdetls(
      prev => (prev = receivable.filter(r => r.ar_custno === selectedcustno))
    );
    navigate('/customerstatementprint');
  };

  useEffect(() => {
    setARCustno(selectedcustno);
  }, [selectedcustno]);

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
                  <Heading size="lg">Customer Statement</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={2}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup spacing={8}>
                      <Button
                        leftIcon={<IconPrinter />}
                        colorScheme="teal"
                        onClick={handlePrint}
                        disabled={!selectedcustno}
                      >
                        Print
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
                    name="ar_custno"
                    //defaultValue={invoice.sls_no || ''}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          Customer No
                        </Text>
                        <Input
                          name="ar_custno"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="customer no"
                          minWidth="100"
                          readOnly
                        />
                      </VStack>
                    )}
                  />
                </FormControl>
                <Box pt={7}>
                  <IconButton
                    onClick={() => handleCustSearch()}
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
                  name="ar_cust"
                  defaultValue={state.ar_cust}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      {/* <FormLabel>Description</FormLabel> */}
                      <Text as="b" fontSize="sm" textAlign="left">
                        Customer
                      </Text>
                      <Input
                        name="ar_cust"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="customer name"
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
                  name="ar_paid"
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      {/* <FormLabel>Description</FormLabel> */}
                      <Text as="b" fontSize="sm" textAlign="left">
                        Payment Status
                      </Text>
                      <RadioGroup
                        name="ar_paid"
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
            overflow="scroll"
            backgroundColor="white"
            px={5}
            mt={5}
          >
            <CustomReactTable
              title={title}
              columns={columns}
              data={receivable.filter(item => {
                switch (paid) {
                  case '0':
                    return item.ar_paid === true || item.ar_paid === false;
                  case '1':
                    return item.ar_paid === true;
                  case '2':
                    return item.ar_paid === false;
                  default:
                    return item.ar_paid === true || item.ar_paid === false;
                }
              })}
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
        isOpen={isCustSearchOpen}
        onClose={onCustSearchClose}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <CustomerSearchTable
              state={state}
              setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_CustDetls}
              statustype={statustype}
              setStatusType={setStatusType}
              onCustomerSearchClose={onCustSearchClose}
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

export default CustomerStatementTable;
