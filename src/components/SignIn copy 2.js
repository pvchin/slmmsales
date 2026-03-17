import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  VStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useCustomToast } from '../helpers/useCustomToast';
import { useUsers } from '../react-query/users/useUsers';
import useLocalStorageState from 'use-local-storage-state';
import { user_localstorage_key } from '../utils/constants';
import ReactEncrypt from 'react-encrypt';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
const secretPass = 'XkhZG4fW2t2W';

const SignIn = () => {
  const toast = useCustomToast();
  const [encrptedData, setEncrptedData] = useState('');
  const [decrptedData, setDecrptedData] = useState('');
  const { users, setUserId } = useUsers();
  const [localstate, setLocalState] = useLocalStorageState(
    user_localstorage_key,
    { defaultValue: {} }
  );

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, id },
  } = useForm();

  const encryptData = text => {
    const encryptedText = ReactEncrypt.encrypt(text);

    setEncrptedData(encryptedText);
    console.log('enctext', encryptedText);
  };

  const decryptData = text => {};

  const handleSignIn = data => {
    const user = users.filter(r => r.userid === data.userid);
    const { password} = user[0]
    const cipherText = CryptoJS.AES.encrypt(data.password, secretPass);
  
    const decrptText = CryptoJS.AES.decrypt(
      password,
      secretPass
    ).toString(CryptoJS.enc.Utf8);
    
    console.log('decrpttext', decrptText);
    if (data.password !== password) {
      toast({
        title: 'Invalid UserId / Password',
        status: 'warning',
      });
    } else {
      setLocalState(data);
    }
  };

  console.log('enc', encrptedData);

  return (
    <Container
      mt={16}
      maxW="lg"
      py={{ base: '12', md: '20' }}
      px={{ base: '0', sm: '8' }}
      border="1px solid teal"
      boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
      borderRadius={{ base: 'none', sm: 'xl' }}
      bg="olive.50"
    >
      <Stack spacing="8">
        <Stack spacing="6">
          {/* <Logo /> */}
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading
              size={useBreakpointValue({ base: 'xs', md: 'md' })}
              color="teal"
              letterSpacing={1}
              pb="5"
              fontWeight={800}
              fontFamily="sans-serif"
            >
              INVENTORY MANAGEMENT SYSTEM
            </Heading>
            <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
              Log in to your account
            </Heading>
            {/* <HStack spacing="1" justify="center">
            <Text color="muted">Don't have an account?</Text>
            <Button variant="link" colorScheme="blue">
            Sign up
            </Button>
          </HStack> */}
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <form>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <Controller
                    control={control}
                    name="userid"
                    //defaultValue={localstate[0].user || ''}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          User ID
                        </Text>
                        <Input
                          name="userid"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="user id"
                          minWidth="100"
                        />
                      </VStack>
                    )}
                  />
                </FormControl>
                <FormControl>
                  <Controller
                    control={control}
                    name="password"
                    //defaultValue={invoice.sls_no || ''}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          Password
                        </Text>
                        <Input
                          name="password"
                          value={value || ''}
                          type="password"
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="password"
                          minWidth="100"
                        />
                      </VStack>
                    )}
                  />
                </FormControl>
              </Stack>
              <Stack spacing="6">
                <Button
                  variant="solid"
                  colorScheme={'teal'}
                  onClick={handleSubmit(handleSignIn)}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default SignIn;
