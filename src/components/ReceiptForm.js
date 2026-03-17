import React, { useState, useEffect } from 'react';
import currency from 'currency.js';
import { nanoid } from 'nanoid';
import { round } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useCustomToast } from '../helpers/useCustomToast';
import { formatPrice } from '../helpers/utils';
import { FiSave } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
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
import CustomDataTable from '../helpers/CustomDataTable';
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  LockIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { TiArrowBack } from 'react-icons/ti';
import { useRecoilState } from 'recoil';
import {
  receiptState,
  receiptdetlsState,
  editReceiptIdState,
  editReceiptDetlsIdState,
} from '../data/atomdata';
import { useAddReceipt } from '../react-query/receipts/useAddReceipt';
import { useUpdateReceipt } from '../react-query/receipts/useUpdateReceipt';
import { useReceiptsDetls } from '../react-query/receiptsdetls/useReceiptsDetls';
import { useAddReceiptsDetls } from '../react-query/receiptsdetls/useAddReceptsDetls';
import { useDeleteReceiptsDetls } from '../react-query/receiptsdetls/useDeleteReceiptsDetls';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentNo';
import { useReceivable } from '../react-query/receivable/useReceivable';
import { useUpdateReceivable } from '../react-query/receivable/useUpdateReceivable';
import CustomerSearchTable from './CustomerSearchTable';
import ReceiptDetlsTable from './ReceiptDetlsTable';
import ReceiptDetlsForm from './ReceiptDetlsForm';
import ReceiptInvoicesTable from './ReceiptInvoicesTable';
import { useGroups } from '../react-query/groups/useGroups';
import GroupForm from './GroupForm';

const initial_batchdetls = {
  rcpd_id: '',
  rcpd_no: '',
  rcpd_invno: '',
  rcpd_invdate: null,
  rcpd_invamt: 0,
  rcpd_last_bal: 0,
  rcpd_disc: 0,
  rcpd_amt: 0,
  rcpd_arid: '',
  rcpd_recdate: null,
  rcpd_branch: '',
};

const initial_group = {
  group_desp: '',
  group_category: '',
};

const ReceiptForm = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { receivable, setARCustno } = useReceivable();
  const addReceipt = useAddReceipt();
  const updateReceipt = useUpdateReceipt();
  const addReceiptsDetls = useAddReceiptsDetls();
  const deleteReceiptsDetls = useDeleteReceiptsDetls();
  const updateReceivable = useUpdateReceivable();

  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('Purchase');
  const [batch, setBatch] = useRecoilState(receiptState);
  const [batchdetls, setBatchdetls] = useRecoilState(receiptdetlsState);
  const [newbatchdetls, setNewBatchdetls] = useState([]);
  const [editBatchId, setEditBatchId] = useRecoilState(editReceiptIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editReceiptDetlsIdState
  );
  const { groups } = useGroups();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [lock, setLock] = useState(batch.po_post);
  const [groupstate, setGroupState] = useState('');
  const [custno, setCustno] = useState('');

  console.log('batch', batch);
  console.log('batch detls', batchdetls);
  console.log('edit batch', editBatchId);
  //console.log('doc', documentno);
  console.log('new batchdetls', newbatchdetls);

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

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();

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
      ...batch,
    },
  });

  const add_Batch = data => {
    console.log('add batch', data);
    const { rcp_no, rcp_date } = data;
    addReceipt({ ...data });
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { rcpd_id, ...fields } = rec;
      addReceiptsDetls({ ...fields, rcpd_no: rcp_no, rcpd_recdate: rcp_date });
      const payamt = rec.rcpd_amt;
      const paydisc = rec.rcpd_disc;
      const lastbal = rec.rcpd_last_bal - rec.rcpd_disc - rec.rcpd_amt;
      const ardata = receivable
        .filter(r => r.ar_invno === rec.rcpd_invno)
        .map(rec => {
          return {
            ...rec,
            ar_balance: lastbal,
            ar_paid_disc: paydisc,
            ar_paid_amt: payamt,
            ar_paid: lastbal > 0 ? false : true,
          };
        });
      updateReceivable({ ...ardata[0] });
      console.log('ardata', ardata);
    });
  };

  const update_Batch = data => {
    console.log('edit batch', data);
    const { ar_no } = data;
    updateReceipt(data);
    // delete old details
    //deleteReceiptsDetls({ rcpd_no: ar_no });
    //add details
    batchdetls.forEach(rec => {
      const { rcpd_id, ...fields } = rec;
      addReceiptsDetls({ ...fields });
    });
  };

  const handleCalc = () => {
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.rcpd_amt;
    }, 0);

    setValue('rcp_total', totalamt);
    setValue('rcp_nettotal', totalamt);
  };

  const handleCustomerSearch = () => {
    onSearchOpen();
  };

  const update_CustDetls = data => {
    const { c_custno, c_cust } = data;
    setARCustno(prev => (prev = c_custno));
    setCustno(prev => c_custno);
    setBatch(
      prev => (prev = { ...batch, rcp_custno: c_custno, rcp_customer: c_cust })
    );
    setValue('rcp_custno', c_custno);
    setValue('rcp_customer', c_cust);
  };

  const onSubmit = values => {
    const { id, status } = editBatchId;
    console.log('status value', status);
    if (status === 'edit') {
      console.log('edit here');
      const newData = { ...values, rcpd_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      const { doc_receipt, doc_abbre } = documentno[0] || 0;
      const docno = doc_receipt;
      const newno = docno + 1;
      const newstrno = (10000000 + newno).toString().substring(1);
      const year = dayjs().year().toString().substring(2);
      const newdocno = 'OR' + year + newstrno + doc_abbre;
      const newdata = { ...values, rcp_no: newdocno };
      updateDocumentno({ ...documentno[0], doc_receipt: newno });
      add_Batch(newdata);
    }

    //console.log('addpurchase', statustype, newstrno, newdata);
    navigate(-1);
  };

  const handleExit = () => {
    navigate(-1);
  };

  const handleEditBatchDetls = data => {
    setStatusType(prev => (prev = 'edit'));
    setSingleBatchDetlsState(data);
    onBatchDetlsOpen(true);
  };

  const handleDeleteBatchDetls = data => {
    const { rcpd_id } = data;
    setEditBatchdetlsId(prev => (prev = { id: rcpd_id }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    setStatusType(prev => (prev = 'add'));
    const data = {
      ...initial_batchdetls,
      rcpd_id: nanoid(),
      rcpd_branch: branch,
      rcpd_no: editBatchId.no,
      rcpd_type: doctype,
    };
    setSingleBatchDetlsState(data);
    //onBatchDetlsOpen(true);
    onBatchDetlsOpen();
  };

  const add_BatchDetls = data => {
    const dataUpdate = { ...data };
    console.log('adddata', dataUpdate);
    const oldData = batchdetls;
    const newData = [...oldData, dataUpdate];
    //   console.log('newdata', newData);
    setBatchdetls(newData);
    setIsCalc(true);
  };

  const update_BatchDetls = data => {
    const dataUpdate = { ...data };
    console.log('editdata', dataUpdate);
    const oldData = batchdetls.filter(r => r.rcpd_id !== data.rcpd_id);
    setBatchdetls([...oldData, dataUpdate]);
    setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.rcpd_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setGroupState(data);
    onGroupOpen();
  };

  const handleRowDoubleClickDetls = e => {
    console.log('rowdoubtclick', e);
    //check for existing
    const existdata =
      batchdetls.length > 0 &&
      batchdetls.filter(r => r.rcpd_invno === e.ar_invno);
    if (existdata.length > 0) {
      toast({
        title: 'This invoice has been applied!',
        status: 'warning',
      });
    } else {
      setStatusType(prev => (prev = 'add'));
      const data = {
        ...initial_batchdetls,
        rcpd_id: nanoid(),
        rcpd_branch: branch,
        rcpd_no: editBatchId.no,
        rcpd_type: doctype,
        rcpd_invno: e.ar_invno,
        rcpd_invdate: e.ar_date,
        rcpd_invamt: e.ar_total,
        rcpd_last_bal: e.ar_balance,
        rcpd_arid: e.ar_id,
        rcpd_amt: e.ar_balance,
      };
      setSingleBatchDetlsState(data);
      onBatchDetlsOpen(true);
    }
  };

  useEffect(() => {
    handleCalc();
    setIsCalc(false);
  }, [isCalc]);

  // useEffect(() => {
  //   update_ap();
  // }, [suppno]);

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
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <form>
          <HStack py={2} spacing="3">
            <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
              <GridItem colSpan={1}>
                <Button
                  leftIcon={<TiArrowBack size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={7}>
                <Center>
                  <Heading size="lg">Official Receipt Form</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem>
              <GridItem colSpan={2}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup>
                      <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        //type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={editBatchId.status === 'edit'}
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<ImExit />}
                        colorScheme="teal"
                        onClick={handleExit}
                      >
                        Exit
                      </Button>
                      {/* <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        onClick={handlePost}
                        disabled={editBatchId.status === 'add'}
                      >
                        Post
                      </Button> */}
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
            <GridItem colSpan={6}>
              <Grid templateColumns={'repeat(6,1fr)'} columnGap={3}>
                <GridItem colSpan={2} mt={field_gap}>
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="rcp_custno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Customer No
                            </Text>
                            <Input
                              name="rcp_custno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="customer no"
                              minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleCustomerSearch()}
                        icon={<SearchIcon />}
                        size="md"
                        colorScheme="teal"
                      />
                    </Box>
                  </HStack>
                </GridItem>
                <GridItem colSpan={4} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="rcp_customer"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Customer
                          </Text>
                          <Input
                            name="rcp_customer"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="customer"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={6} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="rcp_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="rcp_remark"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="remark"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={6}>
              <Grid templateColumns={'repeat(6,1fr)'} columnGap={3}>
                <GridItem colSpan={2} mt={field_gap} w="100%">
                  <FormControl>
                    <Controller
                      control={control}
                      name="rcp_no"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Official Receipt No
                          </Text>
                          <Input
                            name="rcp_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="official receipt no"
                            minWidth="100"
                            readOnly
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
                      name="rcp_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Receipt Date
                          </Text>

                          <Input
                            name="rcp_date"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="receipt date"
                            minWidth="100"
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
                      name="rcp_refno"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Reference No
                          </Text>
                          <Input
                            name="rcp_refno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="reference no"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="rcp_bank"
                        //defaultValue={invoice.oei_type || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Bank
                            </Text>
                            <Select
                              name="rcp_bank"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              //placeholder="category"
                            >
                              <option value="">None</option>
                              {groups &&
                                groups
                                  .filter(r => r.group_category === 'Bank')
                                  .map(rec => {
                                    return (
                                      <option
                                        key={rec.group_id}
                                        value={rec.group_desp}
                                      >
                                        {rec.group_desp}
                                      </option>
                                    );
                                  })}
                            </Select>
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleAddGroup('Bank')}
                        icon={<AddIcon />}
                        size="md"
                        colorScheme="teal"
                      />
                    </Box>
                  </HStack>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="rcp_nettotal"
                      //defaultValue={state.pay_nettotal}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Amount
                          </Text>
                          <Input
                            name="rcp_nettotal"
                            value={value || ''}
                            type="number"
                            align="right"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="total amount"
                            minWidth="100"
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={12} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>
            <GridItem colSpan={12}>
              <ReceiptDetlsTable
                batchdetlsstate={batchdetls}
                setBatchDetlsState={setBatchdetls}
                handleAddBatchDetls={handleAddBatchDetls}
                handleEditBatchDetls={handleEditBatchDetls}
                handleDeleteBatchDetls={handleDeleteBatchDetls}
              />
            </GridItem>
            {/* {editBatchId.status === 'edit' && (
              <GridItem colSpan={12}>
                <PaymentDetlsTable
                  batchdetlsstate={batchdetls}
                  setBatchDetlsState={setBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                />
              </GridItem>
            )} */}

            {editBatchId.status === 'add' && (
              <GridItem colSpan={12}>
                {/* <PaymentDetlsTableNew
                  batchdetlsstate={newbatchdetls}
                  setBatchDetlsState={setNewBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                /> */}
                <ReceiptInvoicesTable
                  batchdetlsstate={receivable}
                  setBatchDetlsState={setNewBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                  handleRowDoubleClick={handleRowDoubleClickDetls}
                />
              </GridItem>
            )}
            <GridItem colSpan={12} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isBatchDetlsOpen}
        onClose={onBatchDetlsClose}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <ReceiptDetlsForm
              state={singlebatchdetlsstate}
              setState={setSingleBatchDetlsState}
              add_Item={add_BatchDetls}
              update_Item={update_BatchDetls}
              statustype={statustype}
              onItemClose={onBatchDetlsClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* <Modal
        closeOnOverlayClick={false}
        isOpen={isBatchDetlsOpen}
        onClose={onBatchDetlsClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
         
          <ModalCloseButton />
          <ModalBody>
            <PaymentDetlsForm
              state={singlebatchdetlsstate}
              setState={setSingleBatchDetlsState}
              add_Item={add_BatchDetls}
              update_Item={update_BatchDetls}
              statustype={statustype}
              onItemClose={onBatchDetlsClose}
            />
          </ModalBody>

        
        </ModalContent>
      </Modal> */}

      <Modal
        closeOnOverlayClick={false}
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <CustomerSearchTable
              //state={state}
              //setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_CustDetls}
              statustype={statustype}
              setStatusType={setStatusType}
              onCustomerSearchClose={onSearchClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isGroupOpen}
        onClose={onGroupClose}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            {/* <ScaleFade initialScale={0.9} in={isGroupOpen}> */}
            <GroupForm
              state={groupstate}
              setState={setGroupState}
              statustype={groupstatustype}
              onGroupClose={onGroupClose}
              grouptype={grouptype}
            />
            {/* </ScaleFade> */}
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
        onConfirm={handleOnDelBatchDetlsConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Item"
      >
        <Heading size="md">Are you sure you want to delete this item?</Heading>
      </AlertDialogBox>
    </Box>
  );
};

export default ReceiptForm;
