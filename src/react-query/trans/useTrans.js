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

async function getAllTransByBranch() {
  const { allTransByBranch } = await graphQLClient.request(
    gql`
      query getAllTransByBranch($branch: String) {
        allTransByBranch(branch: $branch) {
          t_id
          t_no
          t_date
          t_type
          t_docno
          t_docdate
          t_scno
          t_sc
          t_add1
          t_add2
          t_add3
          t_add4
          t_term
          t_branch
          t_remark
          t_post
          t_print
          t_subtotal
          t_disc
          t_nettotal
          t_layout
          t_postdate
          t_glcode
          t_recdate
          t_createdby
          t_updby
          t_createddate
          t_createdtime
          t_upddate
          t_updtime
          t_dono
          t_dodate
          t_name
          t_section
        }
      }
    `,
    { branch }
  );
  return allTransByBranch;
}

async function getTransByBatchno(batchno) {
  const { allTransByBatchno } = await graphQLClient.request(
    gql`
      query getTransByBatchno($batchno: String, $branch: String) {
        allTransByBatchno(scno: $batchno, branch: $branch) {
          t_id
          t_no
          t_date
          t_type
          t_docno
          t_docdate
          t_scno
          t_sc
          t_add1
          t_add2
          t_add3
          t_add4
          t_term
          t_branch
          t_remark
          t_post
          t_print
          t_subtotal
          t_disc
          t_nettotal
          t_layout
          t_postdate
          t_glcode
          t_recdate
          t_createdby
          t_updby
          t_createddate
          t_createdtime
          t_upddate
          t_updtime
          t_dono
          t_dodate
          t_name
          t_section
        }
      }
    `,
    { batchno, branch }
  );
  return allTransByBatchno;
}

export function useTrans() {
  const [tranno, setTranNo] = useState('');

  const fallback = [];
  const { data: trans = fallback } = useQuery({
    queryKey: [queryKeys.trans, tranno],
    queryFn: () => (tranno ? getTransByBatchno(tranno) : getAllTransByBranch()),
  });

  return { trans, setTranNo };
}
