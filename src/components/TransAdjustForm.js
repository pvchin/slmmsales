import React, { useState, useEffect } from 'react';
import currency from 'currency.js';
import { nanoid } from 'nanoid';
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
  //Container,
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
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  //Modal,
  //ModalOverlay,
  //ModalContent,
  //ModalHeader,
  //ModalFooter,
  //ModalBody,
  //ModalCloseButton,
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
import { NumberInput, Modal } from '@mantine/core';
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
import { TiArrowBack, TiPrinter } from 'react-icons/ti';
import { useRecoilState } from 'recoil';
import {
  tranadjustState,
  tranadjustdetlsState,
  editTranadjustIdState,
  editTranadjustDetlsIdState,
} from '../data/atomdata';
import { useAddTransadjust } from '../react-query/transadjust/useAddTransadjust';
import { useUpdateTransadjust } from '../react-query/transadjust/useUpdateTransadjust';
import { useTransadjustDetls } from '../react-query/transadjustdetls/useTransadjustsDetls';
import { useAddTransAdjustDetls } from '../react-query/transadjustdetls/useAddTransAdjustDetls';
import { useDeleteTransAdjustDetls } from '../react-query/transadjustdetls/useDeleteTransAdjustDetls';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentNo';
//import { useAddPayable } from '../react-query/payable/useAddPayable';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useItemsOnhand } from '../react-query/itemsonhand/useItemsOnhand';
import { useUpdateItemsOnhand } from '../react-query/itemsonhand/useUpdateItemsOnhand';
import SupplierSearchTable from './SupplierSearchTable';
import CustomerSearchTable from './CustomerSearchTable';
import TransAdjustDetlsForm from './TransAdjustDetlsForm';
//import TranDetlsServForm from './PurchaseDetlsServForm';
import TransAdjustDetlsTable from './TransAdjustDetlsTable';
import { useTransadjust } from '../react-query/transadjust/useTransadjust';
//import PurchaseDetlsServTable from './PurchaseDetlsServTable';

const initial_batchdetls = {
  tad_id: '',
  tad_batchno: '',
  tad_itemno: '',
  tad_desp: '',
  tad_packing: '',
  tad_qtyonhand: 0,
  tad_qtycount: 0,
  tad_qtyadjust: 0,
  tad_branch: branch,
};

const initial_it = {
  it_transno: '',
  it_itemno: '',
  it_transdate: null,
  it_qty: 0,
  it_value: 0,
  it_disc: 0,
  it_netvalue: 0,
  it_extvalue: 0,
  it_pfactor: 1,
  it_transtype: '',
  it_scno: '',
  it_sc: '',
  it_branch: branch,
  it_postdate: null,
  it_remark: '',
  it_desp: '',
  it_packing: '',
  it_transid: 0,
  it_transidsub: 0,
};

const TransAdjustForm = () => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { suppliers } = useSuppliers();
  const addTransadjust = useAddTransadjust();
  const updateTransadjust = useUpdateTransadjust();
  const addTransadjustDetls = useAddTransAdjustDetls();
  const deleteTransadjustDetls = useDeleteTransAdjustDetls();
  //const addPayable = useAddPayable();
  const addItemsHistory = useAddItemsHistory();
  const { itemsonhand } = useItemsOnhand();
  const updateItemOnhand = useUpdateItemsOnhand();

  const { transadjustdetls } = useTransadjustDetls();
  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('');
  const [batch, setBatch] = useRecoilState(tranadjustState);
  const [batchdetls, setBatchdetls] = useRecoilState(tranadjustdetlsState);
  const [editBatchId, setEditBatchId] = useRecoilState(editTranadjustIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editTranadjustDetlsIdState
  );
  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [tranno, setTranno] = useState(batch.ta_batchno);
  const [totamt, setTotAmt] = useState(batch.ta_subtotal);
  const [totdisc, setTotDisc] = useState(batch.ta_disc);
  const [lock, setLock] = useState(batch.ta_post);

  console.log('batch', batch);
  console.log('batch detls', batchdetls);
  console.log('edit batch', editBatchId);
  console.log('doc', documentno);

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
    isOpen: isBatchDetlsServOpen,
    onOpen: onBatchDetlsServOpen,
    onClose: onBatchDetlsServClose,
  } = useDisclosure();

  const {
    isOpen: isSuppSearchOpen,
    onOpen: onSuppSearchOpen,
    onClose: onSuppSearchClose,
  } = useDisclosure();

  const {
    isOpen: isCustSearchOpen,
    onOpen: onCustSearchOpen,
    onClose: onCustSearchClose,
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
    const { ta_batchno } = data;
    addTransadjust({ ...data });
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { tad_id, ...fields } = rec;
      addTransadjustDetls({ ...fields, tad_batchno: ta_batchno });
    });
  };

  const update_Batch = data => {
    console.log('edit batch data', data);
    const { ta_batchno } = data;
    // delete old details
    deleteTransadjustDetls({ tad_batchno: ta_batchno, tad_branch: branch });
    //const detlsitems = transdetls.filter(r => r.tl_tranno === t_no);
    /* detlsitems.length > 0 &&
      detlsitems.forEach(rec => {
        deleteTranDetls({ tl_tranno: rec.tl_tranno });
      }); */

    // update header
    updateTransadjust(data);
    //add details
    batchdetls.forEach(rec => {
      const { tad_id, ...fields } = rec;
      addTransadjustDetls({ ...fields });
    });
  };

  const handleCalc = () => {
    console.log('calc');
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.tal_excost;
    }, 0);
    setValue('ta_subtotal', totalamt);
    setValue('ta_nettotal', totalamt - totdisc);
  };

  const handleSupplierSearch = () => {
    onSuppSearchOpen();
  };

  const update_SuppDetls = data => {
    const { s_suppno, s_supp } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          ta_scno: s_suppno,
          ta_sc: s_supp,
        })
    );
    setValue('ta_scno', s_suppno);
    setValue('ta_sc', s_supp);
  };

  const handleSearchSupp = data => {
    const result = suppliers.filter(r => r.s_suppno === data);
    update_SuppDetls(...result);
  };

  const handleCustSearch = () => {
    onCustSearchOpen();
  };

  const update_CustDetls = data => {
    const { c_custno, c_cust } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          ta_scno: c_custno,
          ta_sc: c_cust,
        })
    );
    setValue('ta_scno', c_custno);
    setValue('ta_sc', c_cust);
  };

  const onSubmit = values => {
    const { id, status } = editBatchId;
    console.log('status value', status);
    if (status === 'edit') {
      console.log('edit here');
      const newData = { ...values, ta_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      const { doc_adjust, doc_abbre } = documentno[0] || 0;
      let docno = doc_adjust;
      let docabbre = '';

      const newno = docno + 1;
      const newstrno = (10000000 + newno).toString().substring(1);
      const year = dayjs().year().toString().substring(2);
      const newdocno = docabbre + year + newstrno + doc_abbre;
      const newdata = { ...values, ta_batchno: newdocno };
      updateDocumentno({ ...documentno[0], doc_adjust: newno });

      add_Batch(newdata);
    }

    //console.log('addpurchase', statustype, newstrno, newdata);
    navigate(-1);
  };

  const handleExit = () => {
    navigate(-1);
  };

  const handleEditBatchDetls = row => {
    const { original } = row;
    console.log('edit', original);
    setStatusType(prev => (prev = 'edit'));
    setSingleBatchDetlsState(original);
    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const handleDeleteBatchDetls = row => {
    const { original } = row;
    const { tad_id } = original;
    setEditBatchdetlsId(prev => (prev = { id: tad_id }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    setStatusType(prev => (prev = 'add'));
    const data = {
      ...initial_batchdetls,
      tad_id: nanoid(),
      tad_branch: branch,
      tad_batchno: editBatchId.no,
    };
    setSingleBatchDetlsState(data);
    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
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
    const oldData = batchdetls.filter(r => r.tad_id !== data.tad_id);
    setBatchdetls([...oldData, dataUpdate]);
    setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.tad_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

  useEffect(() => {
    handleCalc();
    setIsCalc(false);
  }, [isCalc, totamt, totdisc]);

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
                  leftIcon={<TiArrowBack size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={6}>
                <Center>
                  <Heading size="lg">Transaction Adjustment Form</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem>
              <GridItem colSpan={3}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup>
                      <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        //type="submit"
                        onClick={handleSubmit(onSubmit)}
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<ImExit />}
                        colorScheme="teal"
                        //onClick={handleExit}
                      >
                        Exit
                      </Button>
                      <Button
                        leftIcon={<TiPrinter />}
                        colorScheme="teal"
                        //onClick={handlePrint}
                        //disabled={editBatchId.status === 'add' || lock === '1'}
                      >
                        Print
                      </Button>
                      <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        //onClick={handlePost}
                        disabled={
                          editBatchId.status === 'add' || tranno.length === 0
                        }
                      >
                        Post
                      </Button>
                    </ButtonGroup>
                  </HStack>
                </Flex>
              </GridItem>
            </Grid>
          </HStack>
          <Grid
            templateColumns={'repeat(6,1fr)'}
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
                <GridItem colSpan={2} mt={field_gap} w="100%">
                  <FormControl>
                    <Controller
                      control={control}
                      name="ta_batchno"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Batch No
                          </Text>
                          <Input
                            name="ta_batchno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="batch no"
                            //="100"
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
                      name="ta_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Batch Date
                          </Text>

                          <Input
                            name="ta_date"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="batch date"
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
                      name="ta_type"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Doc Type
                          </Text>
                          <Select
                            name="ta_type"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                          >
                            <option value="Adjustment">Adjustment</option>
                          </Select>
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
                        name="ta_scno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              From / To
                            </Text>
                            <Input
                              name="ta_scno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="from / to"
                              //minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        //onClick={() => handleSupplierSearch()}
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
                      name="ta_sc"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Name
                          </Text>
                          <Input
                            name="ta_sc"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="name"
                            //minWidth="100"
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
                      name="ta_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="ta_remark"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="remark"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={6} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>
            <GridItem colSpan={6}>
              <TransAdjustDetlsTable
                batchdetlsstate={batchdetls}
                setBatchDetlsState={setBatchdetls}
                handleAddBatchDetls={handleAddBatchDetls}
                handleEditBatchDetls={handleEditBatchDetls}
                handleDeleteBatchDetls={handleDeleteBatchDetls}
              />
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal
        opened={isBatchDetlsOpen}
        onClose={onBatchDetlsClose}
        size="2x1"
        borderRadius="20"
      >
        <TransAdjustDetlsForm
          state={singlebatchdetlsstate}
          setState={setSingleBatchDetlsState}
          add_Item={add_BatchDetls}
          update_Item={update_BatchDetls}
          statustype={statustype}
          onItemClose={onBatchDetlsClose}
        />
      </Modal>
      <Modal opened={isSuppSearchOpen} onClose={onSuppSearchClose} size="4x1">
        <SupplierSearchTable
          update_Item={update_SuppDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onSupplierSearchClose={onSuppSearchClose}
        />
      </Modal>
      <Modal opened={isCustSearchOpen} onClose={onCustSearchClose} size="4x1">
        <CustomerSearchTable
          update_Item={update_SuppDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onSupplierSearchClose={onCustSearchClose}
        />
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

export default TransAdjustForm;
