import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';

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

async function getAllPurchasesDetls() {
  const { allPurchasesDetlsByBranch } = await graphQLClient.request(
    gql`
      query getPurchasesDetlsByBranch($branch: String) {
        allPurchasesDetlsByBranch(branch: $branch) {
          pl_id
          pl_pono
          pl_type
          pl_itemno
          pl_desp
          pl_brand
          pl_packing
          pl_pfactor
          pl_unit
          pl_qty
          pl_ucost
          pl_netucost
          pl_disc
          pl_excost
          pl_remark
          pl_order
          pl_branch
          pl_uoldcost
        }
      }
    `,
    { branch }
  );
  return allPurchasesDetlsByBranch;
}

async function getPurchasesDetlsByPONo(pono) {
  const { allPurchasesDetlsByPONo } = await graphQLClient.request(
    gql`
      query getPurchasesDetls($pono: String, $branch: String) {
        allPurchasesDetlsByPONo(pono: $pono, branch: $branch) {
          pl_id
          pl_pono
          pl_type
          pl_itemno
          pl_desp
          pl_brand
          pl_packing
          pl_pfactor
          pl_unit
          pl_qty
          pl_ucost
          pl_netucost
          pl_disc
          pl_excost
          pl_remark
          pl_order
          pl_branch
          pl_uoldcost
        }
      }
    `,
    { pono, branch }
  );
  return allPurchasesDetlsByPONo;
}

export function usePurchasesDetls() {
  const [pono, setPONo] = useState('');

  const fallback = [];
  const { data: purchasesdetls = fallback } = useQuery({
    queryKey: [queryKeys.purchasesdetls, pono],
    queryFn: () =>
      pono ? getPurchasesDetlsByPONo(pono) : getAllPurchasesDetls(),
  });

  return { purchasesdetls, setPONo };
}
