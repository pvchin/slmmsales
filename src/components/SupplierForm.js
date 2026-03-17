import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
import { AddIcon } from '@chakra-ui/icons'
//import { AiOutlinePlus } from 'react-icons/ai';
//import { ImExit } from 'react-icons/im';
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

import { useGroups } from '../react-query/groups/useGroups';
import GroupForm from './GroupForm';

const initial_group = {
  group_desp: '',
  group_category: '',
};

const SupplierForm = ({
  state,
  setState,
  add_Supp,
  update_Supp,
  statustype,
  onSuppClose,
}) => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { groups } = useGroups();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');

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
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const onSubmit = values => {
    if (statustype === 'edit') {
      update_Supp(values);
    }
    if (statustype === 'add') {
      add_Supp(values);
    }
    onSuppClose();
  };

  const handleExit = () => {
    onSuppClose();
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setState(data);
    onGroupOpen();
  };

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
        p="2"
        spacing="10"
        //alignItems="flex-start"
      >
        <VStack pt={2} spacing="3" alignItems="center">
          <Heading size="lg">Supplier Form</Heading>
        </VStack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid blue"
            borderRadius="20"
            backgroundColor="blue.50"
          >
            <GridItem colSpan={2} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_suppno"
                  defaultValue={state.s_suppno}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Supplier No
                      </Text>
                      <Input
                        name="s_suppno"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="supplier no"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={7} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_supp"
                  defaultValue={state.s_supp}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Supplier
                      </Text>
                      <Input
                        name="s_supp"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="supplier name"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_add1"
                  defaultValue={state.s_add1}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Address
                      </Text>
                      <Input
                        name="s_add1"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={0}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_add2"
                  defaultValue={state.s_add2}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      {/* <Text as="b" fontSize="sm">
                        Address
                      </Text> */}
                      <Input
                        name="s_add2"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={0}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_add3"
                  defaultValue={state.s_add3}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      {/* <Text as="b" fontSize="sm">
                        Address
                      </Text> */}
                      <Input
                        name="s_add3"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={0}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_add4"
                  defaultValue={state.s_add4}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      {/* <Text as="b" fontSize="sm">
                        Address
                      </Text> */}
                      <Input
                        name="s_add4"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_phone"
                  defaultValue={state.s_phone}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Tel No
                      </Text>
                      <Input
                        name="s_phone"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="tel no"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_fax"
                  defaultValue={state.s_fax}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Fax No
                      </Text>
                      <Input
                        name="s_fax"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="fax no"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_email"
                  defaultValue={state.s_email}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Email
                      </Text>
                      <Input
                        name="s_email"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="email"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_contact"
                  defaultValue={state.s_contact}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Contact Person
                      </Text>
                      <Input
                        name="s_contact"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="contact person"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="s_terms"
                    defaultValue={state.s_terms}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack w="100%" py={1} align="left">
                        <Text as="b" fontSize="sm">
                          Credit Terms
                        </Text>
                        <Select
                          name="s_terms"
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
                              .filter(r => r.group_category === 'Credit Terms')
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
                    onClick={() => handleAddGroup('Credit Terms')}
                    icon={<AddIcon />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
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
        isOpen={isGroupOpen}
        onClose={onGroupClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <GroupForm
              state={state}
              setState={setState}
              statustype={groupstatustype}
              onGroupClose={onGroupClose}
              grouptype={grouptype}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default SupplierForm;
