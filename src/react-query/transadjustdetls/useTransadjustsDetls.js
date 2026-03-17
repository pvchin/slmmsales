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

async function getTransadjustDetlsByBranch() {
  const { allTransadjustDetlsByBranch } = await graphQLClient.request(
    gql`
      query getTransadjustDetlsByBranch($branch: String) {
        allTransadjustDetlsByBranch(branch: $branch) {
          tad_id
          tad_batchno
          tad_itemno
          tad_desp
          tad_packing
          tad_qtyonhand
          tad_qtycount
          tad_qtyadjust
          tad_unit
          tad_remark
          tad_branch
        }
      }
    `,
    { branch }
  );
  return allTransadjustDetlsByBranch;
}

async function getTransadjustDetlsByTranNo(tranno) {
  const { allTransadjustDetlsByTranNo } = await graphQLClient.request(
    gql`
      query getTransadjustDetlsByTranNo($tranno: String, $branch: String) {
        allTransadjustDetlsByTranno(tranno: $tranno, branch: $branch) {
          tad_id
          tad_id
          tad_batchno
          tad_itemno
          tad_desp
          tad_packing
          tad_qtyonhand
          tad_qtycount
          tad_qtyadjust
          tad_unit
          tad_remark
          tad_branch
        }
      }
    `,
    { tranno, branch }
  );
  return allTransadjustDetlsByTranNo;
}

export function useTransadjustDetls() {
  const [batchno, setBatchNo] = useState('');

  const fallback = [];
  const { data: transadjustdetls = fallback } = useQuery({
    queryKey: [queryKeys.transadjustdetls, batchno],
    queryFn: () =>
      batchno
        ? getTransadjustDetlsByTranNo(batchno)
        : getTransadjustDetlsByBranch(),
  });

  return { transadjustdetls, setBatchNo };
}
