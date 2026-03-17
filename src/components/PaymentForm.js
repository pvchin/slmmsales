import React, { useState, useEffect } from 'react';
import currency from 'currency.js';
import { nanoid } from 'nanoid';
import { round } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useCustomToast } from '../helpers/useCustomToast';
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
import { LockIcon } from '@chakra-ui/icons';
import {
  IconArrowBackUp,
  IconPrinter,
  IconSearch,
  IconDeviceFloppy,
  IconDoorExit,
  IconPlus,
} from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import {
  paymentState,
  paymentdetlsState,
  editPaymentIdState,
  editPaymentDetlsIdState,
} from '../data/atomdata';
import { useAddPayment } from '../react-query/payments/useAddPayment';
import { useUpdatePayment } from '../react-query/payments/useUpdatePayment';
import { usePaymentDetls } from '../react-query/paymentsdetls/useAddPaymentDetls';
import { useAddPaymentDetls } from '../react-query/paymentsdetls/useAddPaymentDetls';
import { useDeletePaymentDetls } from '../react-query/paymentsdetls/useDeletePaymentDetls';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentNo';
import { usePayable } from '../react-query/payable/usePayable';
import { useUpdatePayable } from '../react-query/payable/useUpdatePayable';
import SupplierSearchTable from './SupplierSearchTable';
import AccountSearchTable from './AccountSearchTable';
import PaymentDetlsTable from './PaymentDetlsTable';
import PaymentDetlsForm from './PaymentDetlsForm';
import PaymentInvoicesTable from './PaymentInvoicesTable';
import { useGroups } from '../react-query/groups/useGroups';
import GroupForm from './GroupForm';

const initial_batchdetls = {
  payd_id: '',
  payd_no: '',
  payd_invno: '',
  payd_invdate: null,
  payd_pono: '',
  payd_podate: null,
  payd_invamt: 0,
  payd_last_bal: 0,
  payd_disc: 0,
  payd_amt: 0,
  payd_apid: 0,
  payd_recdate: null,
  payd_branch: '',
  payd_paydate: null,
};

const initial_group = {
  group_desp: '',
  group_category: '',
};

const PaymentForm = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { payable, setAPSuppno } = usePayable();
  const addPayment = useAddPayment();
  const updatePayment = useUpdatePayment();
  const addPaymentDetls = useAddPaymentDetls();
  const deletePaymentDetls = useDeletePaymentDetls();
  const updatePayable = useUpdatePayable();

  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('Purchase');
  const [batch, setBatch] = useRecoilState(paymentState);
  const [batchdetls, setBatchdetls] = useRecoilState(paymentdetlsState);
  const [newbatchdetls, setNewBatchdetls] = useState([]);
  const [editBatchId, setEditBatchId] = useRecoilState(editPaymentIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editPaymentDetlsIdState
  );
  const { groups } = useGroups();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [lock, setLock] = useState(batch.po_post);
  const [groupstate, setGroupState] = useState('');
  const [suppno, setSuppno] = useState('');
  const [accno, setAccno] = useState('');

  //console.log('batch', batch);
  //console.log('batch detls', batchdetls);
  //console.log('edit batch', editBatchId);
  //console.log('doc', documentno);
  //console.log('new batchdetls', newbatchdetls);

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
    isOpen: isAccountSearchOpen,
    onOpen: onAccountSearchOpen,
    onClose: onAccountSearchClose,
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
    const { pay_no, pay_date } = data;
    addPayment({ ...data });
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { payd_id, ...fields } = rec;
      addPaymentDetls({ ...fields, payd_no: pay_no, payd_paydate: pay_date });
      const payamt = rec.payd_amt;
      const paydisc = rec.payd_disc;
      const lastbal = rec.payd_last_bal - rec.payd_disc - rec.payd_amt;
      const apdata = payable
        .filter(r => r.ap_invno === rec.payd_invno)
        .map(rec => {
          return {
            ...rec,
            ap_balance: lastbal,
            ap_paid_disc: paydisc,
            ap_paid_amt: payamt,
            ap_paid: lastbal > 0 ? false : true,
          };
        });
      updatePayable({ ...apdata[0] });
      console.log('apdata', apdata);
    });
  };

  const update_Batch = data => {
    console.log('edit batch', data);
    const { po_no } = data;
    updatePayment(data);
    // delete old details
    deletePaymentDetls({ pl_pono: po_no });
    //add details
    batchdetls.forEach(rec => {
      const { pl_id, ...fields } = rec;
      addPaymentDetls({ ...fields });
    });
  };

  const handleCalc = () => {
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.payd_amt;
    }, 0);

    setValue('pay_total', totalamt);
    setValue('pay_nettotal', totalamt);
  };

  const handleSupplierSearch = () => {
    onSearchOpen();
  };

  const update_SuppDetls = data => {
    const { s_suppno, s_supp } = data;
    setAPSuppno(prev => (prev = s_suppno));
    setSuppno(prev => s_suppno);
    setBatch(
      prev => (prev = { ...batch, pay_suppno: s_suppno, pay_supp: s_supp })
    );
    setValue('pay_suppno', s_suppno);
    setValue('pay_supplier', s_supp);
  };

  const handleAccountSearch = () => {
    onAccountSearchOpen();
  };

  const update_GLDetls = data => {
    const { acc_code, acc_name } = data;
    setAPSuppno(prev => (prev = acc_code));
    setAccno(prev => acc_code);
    setBatch(
      prev => (prev = { ...batch, pay_glcode: acc_code, pay_glname: acc_name })
    );
    setValue('pay_glcode', acc_code);
    setValue('pay_glname', acc_name);
  };

  const onSubmit = values => {
    const { id, status } = editBatchId;
    console.log('status value', status);
    if (status === 'edit') {
      console.log('edit here');
      const newData = { ...values, payd_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      const { doc_payment, doc_abbre } = documentno[0] || 0;
      const docno = doc_payment;
      const newno = docno + 1;
      const newstrno = (10000000 + newno).toString().substring(1);
      const year = dayjs().year().toString().substring(2);
      const newdocno = 'PV' + year + newstrno + doc_abbre;
      const newdata = { ...values, pay_no: newdocno };
      updateDocumentno({ ...documentno[0], doc_payment: newno });
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
    const { payd_id } = data;
    setEditBatchdetlsId(prev => (prev = { id: payd_id }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    setStatusType(prev => (prev = 'add'));
    const data = {
      ...initial_batchdetls,
      payd_id: nanoid(),
      payd_branch: branch,
      payd_no: editBatchId.no,
      payd_type: doctype,
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
    const oldData = batchdetls.filter(r => r.payd_id !== data.payd_id);
    setBatchdetls([...oldData, dataUpdate]);
    setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.payd_id !== id);
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
      batchdetls.filter(r => r.payd_invno === e.ap_invno);
    if (existdata.length > 0) {
      toast({
        title: 'This invoice has been applied!',
        status: 'warning',
      });
    } else {
      setStatusType(prev => (prev = 'add'));
      const data = {
        ...initial_batchdetls,
        payd_id: nanoid(),
        payd_branch: branch,
        payd_no: editBatchId.no,
        payd_type: doctype,
        payd_invno: e.ap_invno,
        payd_invdate: e.ap_invdate,
        payd_pono: e.ap_pono,
        payd_podate: e.ap_podate,
        payd_invamt: e.ap_nettotal_amt,
        payd_last_bal: e.ap_balance,
        payd_apid: e.ap_id,
        payd_amt: e.ap_balance,
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
                  leftIcon={<IconArrowBackUp size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={6}>
                <Center>
                  <Heading size="lg">Payment Voucher Form</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem>
              <GridItem colSpan={3}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup spacing={5}>
                      <Button
                        leftIcon={<IconDeviceFloppy />}
                        colorScheme="teal"
                        //type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={editBatchId.status === 'edit'}
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<IconPrinter />}
                        colorScheme="teal"
                        onClick={handleExit}
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
                        name="pay_suppno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Supplier No
                            </Text>
                            <Input
                              name="pay_suppno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="supplier no"
                              minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleSupplierSearch()}
                        icon={<IconSearch />}
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
                      name="pay_supplier"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Supplier
                          </Text>
                          <Input
                            name="pay_supplier"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="supplier"
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
                      name="pay_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="pay_remark"
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
                      name="pay_no"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Payment Voucher No
                          </Text>
                          <Input
                            name="pay_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="payment voucher no"
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
                      name="pay_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Payment Date
                          </Text>

                          <Input
                            name="pay_date"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="payment date"
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
                      name="pay_refno"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Reference No
                          </Text>
                          <Input
                            name="pay_refno"
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
                        name="pay_bank"
                        //defaultValue={invoice.oei_type || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Bank
                            </Text>
                            <Select
                              name="pay_bank"
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
                        icon={<IconPlus />}
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
                      name="pay_nettotal"
                      //defaultValue={state.pay_nettotal}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Amount
                          </Text>
                          <Input
                            name="pay_nettotal"
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
                <GridItem colSpan={2} mt={field_gap}></GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="pay_glcode"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              GL Code
                            </Text>
                            <Input
                              name="pay_glcode"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="gl code"
                              minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleAccountSearch()}
                        icon={<IconSearch />}
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
                      name="pay_glname"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            GL Name
                          </Text>
                          <Input
                            name="pay_glname"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="gl name"
                            minWidth="100"
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
              <PaymentDetlsTable
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
                <PaymentInvoicesTable
                  batchdetlsstate={payable}
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
            <SupplierSearchTable
              //state={state}
              //setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_SuppDetls}
              statustype={statustype}
              setStatusType={setStatusType}
              onSupplierSearchClose={onSearchClose}
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
        isOpen={isAccountSearchOpen}
        onClose={onAccountSearchClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <AccountSearchTable
              //state={state}
              //setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_GLDetls}
              statustype={statustype}
              setStatusType={setStatusType}
              onAccountSearchClose={onAccountSearchClose}
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

export default PaymentForm;
