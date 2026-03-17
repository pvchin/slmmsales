import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';
import { branch } from '../../utils/constants';
import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL);

async function getSetup() {
  const { setup } = await graphQLClient.request(
    gql`
      query {
        setup {
          S_ID
          S_Code
          S_Value
        }
      }
    `
  );
  return setup;
}

export function useSetup() {
  const [filter, setFilter] = useState('all');
  const [docId, setDocId] = useState('');

  const fallback = [];
  const { data: setup = fallback } = useQuery({
    queryKey: [queryKeys.setup],
    queryFn: () => getSetup(),
  });

  return { setup, filter, setFilter, setDocId };
}
