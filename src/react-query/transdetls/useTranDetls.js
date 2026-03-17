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

async function getTransDetlsByBranch() {
  const { allTransDetlsByBranch } = await graphQLClient.request(
    gql`
      query getTransDetlsByBranch($branch: String) {
        allTransDetlsByBranch(branch: $branch) {
          tl_id
          tl_tranno
          tl_type
          tl_itemno
          tl_desp
          tl_brand
          tl_packing
          tl_pfactor
          tl_unit
          tl_qty
          tl_ucost
          tl_netucost
          tl_disc
          tl_excost
          tl_remark
          tl_order
          tl_branch
          tl_uoldcost
        }
      }
    `,
    { branch }
  );
  return allTransDetlsByBranch;
}

async function getTransDetlsByTranNo(tranno) {
  const { allTransDetlsByTranNo } = await graphQLClient.request(
    gql`
      query getTransDetlsByTranNo($tranno: String, $branch: String) {
        allTransDetlsByTranNo(tranno: $tranno, branch: $branch) {
          tl_id
          tl_tranno
          tl_type
          tl_itemno
          tl_desp
          tl_brand
          tl_packing
          tl_pfactor
          tl_unit
          tl_qty
          tl_ucost
          tl_netucost
          tl_disc
          tl_excost
          tl_remark
          tl_order
          tl_branch
          tl_uoldcost
        }
      }
    `,
    { tranno, branch }
  );
  return allTransDetlsByTranNo;
}

export function useTransDetls() {
  const [tranno, setTranNo] = useState('');

  const fallback = [];
  const { data: transdetls = fallback } = useQuery({
    queryKey: [queryKeys.transdetls, tranno],
    queryFn: () =>
      tranno ? getTransDetlsByTranNo(tranno) : getTransDetlsByBranch(),
  });

  return { transdetls, setTranNo };
}
