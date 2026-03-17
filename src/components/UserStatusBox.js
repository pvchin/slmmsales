import React, { useState } from 'react';
import {
  Avatar,
  Button,
  IconButton,
  Heading,
  Stack,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import useLocalStorageState from 'use-local-storage-state';
import { user_localstorage_key } from '../utils/constants';

const UserStatusBox = () => {
  const [localstate, setLocalState, { removeItem }] = useLocalStorageState(
    user_localstorage_key
  );
  // const { clearStoredUser } = useUserContext();

  const handleSignOut = () => {
    removeItem();
  };

  return (
    <HStack justify="space-between">
      <Heading size="sm">
        {localstate.userid.length > 0 ? localstate.userid : 'unknown'}
      </Heading>

      {localstate.userid.length > 0 && (
        <IconButton
          icon={<RiLogoutBoxRLine />}
          display={{ base: 'none', md: 'inline-flex' }}
          fontSize={'28'}
          fontWeight={600}
          color='teal'
          bg={'white'}
          href={'#'}
          _hover={{
            bg: 'teal.300',
          }}
          onClick={handleSignOut}
        ></IconButton>
      )}
    </HStack>
  );
};

export default UserStatusBox;
