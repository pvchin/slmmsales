import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
} from '@chakra-ui/react';
import { MantineProvider } from '@mantine/core';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { theme } from './theme';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';
//import { useUserQuery} from './react-query/global/useUserQuery'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from './components/Main';
import SignIn from './components/SignIn';
import { Loading } from './helpers/Loading';
import useLocalStorageState from 'use-local-storage-state';
import { user_localstorage_key } from './utils/constants';

const queryClient = new QueryClient();

const themeMantine = {
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: 'Montserrat, Verdana, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'Greycliff CF, sans-serif' },
};

function App() {
  const [localstate, setLocalState] = useLocalStorageState(
    user_localstorage_key,
    { defaultValue: {} }
  );
  console.log('localstate', localstate);
  return (
    <MantineProvider theme={themeMantine}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RecoilRoot>
              <Box textAlign="center" fontSize="xl">
                {localstate.userid ? <Main /> : <SignIn />}
              </Box>
              <Loading />
              <ToastContainer
                autoClose={2000}
                position={'bottom-center'}
                theme="dark"
              />
              <ReactQueryDevtools />
            </RecoilRoot>
          </BrowserRouter>
        </QueryClientProvider>
      </ChakraProvider>
    </MantineProvider>
  );
}

export default App;
