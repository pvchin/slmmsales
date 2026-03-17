import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
import { FiSave } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
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
import { NumberInput } from '@mantine/core';
import { useItems } from '../react-query/items/useItems';
import ItemSearchTable from './ItemSearchTable';

const TransAdjustDetlsForm = ({
  state,
  setState,
  statustype,
  add_Item,
  update_Item,
  onItemClose,
}) => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [qtyonhand, setQtyOnhand] = useState(state.tad_qtyonhand);
  const [qtycount, setQtyCount] = useState(state.tad_qtycount);
  const [qtyadjust, setQtyAdjust] = useState(state.tad_qtyadjust);
  const [ucost, setUCost] = useState(state.tad_netucost);

  //console.log('batchdetls state', state);
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
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
      ...state,
    },
  });

  const onSubmit = values => {
    //console.log('status', statustype);
    if (statustype === 'edit') {
      update_Item(values);
    }
    if (statustype === 'add') {
      add_Item(values);
    }
    onItemClose();
  };

  const handleExit = () => {
    onItemClose();
  };

  const update_ItemDetls = data => {
    console.log('upditem', data);
    const {
      item_no,
      item_desp,
      item_packing,
      item_unit,
      item_qoh_pc,
      item_ucost_pc,
    } = data;
    setValue('tad_itemno', item_no);
    setValue('tad_desp', item_desp);
    setValue('tad_packing', item_packing);
    setValue('tad_unit', item_unit);
    setValue('tad_qtyonhand', item_qoh_pc);
    //setValue('tl_ucost', item_ucost_pc);
    //setValue('tl_netucost', item_ucost_pc);
    setQtyCount(prev => (prev = 0));
    setQtyAdjust(prev => (prev = 0));
    setUCost(prev => (prev = item_ucost_pc));
  };

  const calcQty = data => {
    const qtyqoh = getValues('tad_qtyonhand');
    const qtycnt = getValues('tad_qtycount');
    const qty = Math.round(qtyqoh - qtycnt, 2);
    setQtyAdjust(prev => (prev = qty));
    setValue('tad_qtyadjust', qty);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  useEffect(() => {
    calcQty();
  }, [qtycount]);

  return (
    <Flex
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="0"
        spacing="10"
        //alignItems="flex-start"
      >
        <VStack pt={1} spacing="3" alignItems="center">
          <Heading size="lg">Details Form</Heading>
        </VStack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full' }}
            border="1px solid teal"
            borderRadius="20"
            backgroundColor="teal.50"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="tad_itemno"
                    defaultValue={state.tad_itemno}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="Item No"
                            minWidth={field_width}
                          />
                          <Input
                            name="tad_itemno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="item no"
                            minWidth="100"
                          />
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Box pt={0}>
                  <IconButton
                    onClick={() => handleItemSearch()}
                    icon={<AiOutlineSearch />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_desp"
                  defaultValue={state.tad_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_desp"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item description"
                          minWidth="200"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_packing"
                  defaultValue={state.tad_packing}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Packing"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_packing"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item packing"
                          minWidth="500"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_unit"
                  defaultValue={state.tad_unit}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_unit"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="unit"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_qtyonhand"
                  defaultValue={state.tad_qtyonhand}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Onhand"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tad_qtyonhand"
                          value={value || 0}
                          width="full"
                          precision={2}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          onChange={e => {
                            onChange(e);
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_qtycount"
                  defaultValue={state.tad_qtycount}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Count"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tad_qtycount"
                          value={value || 0}
                          width="full"
                          precision={2}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          onChange={e => {
                            onChange(e);
                            setQtyCount(prev => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_qtyadjust"
                  defaultValue={state.tad_qtyadjust}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Adjust"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tad_qtyadjust"
                          value={value || 0}
                          width="full"
                          precision={2}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          onChange={e => {
                            onChange(e);
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_remark"
                  defaultValue={state.tad_remark}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Remark"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_remark"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="remark"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Box>
            <Center>
              <Button
                mt={4}
                ml={4}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
              <Button
                mt={4}
                ml={10}
                colorScheme="teal"
                isLoading={isSubmitting}
                onClick={handleExit}
              >
                Close
              </Button>
            </Center>
          </Box>
        </form>
      </VStack>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <ItemSearchTable
              state={state}
              setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_ItemDetls}
              statustype={statustype}
              //setStatusType={setStatusType}
              onItemSearchClose={onSearchClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TransAdjustDetlsForm;
