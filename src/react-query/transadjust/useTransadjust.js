import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";

import axios from 'axios';
import { queryKeys } from '../constants';
import { branch } from '../../utils/constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getTransadjustByBranch() {
  const { allTransadjustByBranch } = await graphQLClient.request(
    gql`
      query getTransadjustByBranch($branch: String) {
        allTransadjustByBranch(branch: $branch) {
          ta_id
          ta_batchno
          ta_date
          ta_userid
          ta_user
          ta_remark
          ta_post
          ta_branch
          ta_type
          ta_subtotal
          ta_disc
          ta_nettotal
          ta_scno
          ta_sc
        }
      }
    `,
    { branch }
  );
  return allTransadjustByBranch;
}

export function useTransadjust() {
  const [tranno, setTranNo] = useState('');

  const fallback = [];
  const { data: transadjust = fallback } = useQuery({
    queryKey: [queryKeys.transadjust, tranno],
    queryFn: () => getTransadjustByBranch(),
  });

  return { transadjust, setTranNo };
}
