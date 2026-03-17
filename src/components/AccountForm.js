import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
import { AddIcon } from '@chakra-ui/icons';
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

const AccountForm = ({
  state,
  setState,
  add_Acc,
  update_Acc,
  statustype,
  onAccClose,
}) => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { groups } = useGroups();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [isgroupitem, setIsGroupItem] = useState(false);

  console.log('state', state);
  console.log('isgroupitem', isgroupitem);

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
    //console.log('status', statustype);
    //console.log('values', values);
    if (statustype === 'edit') {
      update_Acc(values);
    }
    if (statustype === 'add') {
      //console.log('values', values);
      add_Acc(values);
    }
    onAccClose();
  };

  const handleExit = () => {
    onAccClose();
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setState(data);
    onGroupOpen();
  };

  useEffect(() => {
    setIsGroupItem(state.acc_groupitem);
  }, []);

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
          <Heading size="lg">GL Account Form</Heading>
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
            border="1px solid teal"
            borderRadius="20"
            //backgroundColor="blue.50"
          >
            <GridItem colSpan={2} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="acc_code"
                  defaultValue={state.acc_code}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        GL Code
                      </Text>
                      <Input
                        name="acc_code"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="gl account code"
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
                  name="acc_name"
                  defaultValue={state.acc_name}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        GL Account Name
                      </Text>
                      <Input
                        name="acc_name"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="gl account name"
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
                  name="acc_cat"
                  defaultValue={state.acc_cat}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      <Text as="b" fontSize="sm">
                        Category
                      </Text>
                      <Input
                        name="acc_cat"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="category"
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
                  name="acc_type"
                  defaultValue={state.acc_type}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      <Text as="b" fontSize="sm">
                        Type
                      </Text>
                      <Input
                        name="acc_type"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="account type"
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
                  name="acc_class"
                  defaultValue={state.acc_class}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      <Text as="b" fontSize="sm">
                        Class
                      </Text>
                      <Input
                        name="acc_class"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="account class"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2} mt={field_gap} pt={5} pl={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="acc_groupitem"
                  defaultValue={isgroupitem}
                  render={({ field: { onChange, value, ref } }) => (
                    <HStack>
                      <Checkbox
                        name="acc_groupitem"
                        value={value || ''}
                        width="full"
                        isChecked={isgroupitem}
                        onChange={e => {
                          onChange(e.target.checked);
                          setIsGroupItem(e.target.checked);
                        }}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                      >
                        <Text as="b">Group Item</Text>
                      </Checkbox>
                    </HStack>
                  )}
                />
              </FormControl>
            </GridItem>
            {/*  <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="c_area"
                    defaultValue={state.c_area}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack w="100%" py={1} align="left">
                        <Text as="b" fontSize="sm">
                          Area
                        </Text>
                        <Select
                          name="c_area"
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
                              .filter(r => r.group_category === 'Area')
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
                    onClick={() => handleAddGroup('Area')}
                    icon={<AddIcon />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem> */}
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

export default AccountForm;
