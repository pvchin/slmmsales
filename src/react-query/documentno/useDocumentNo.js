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

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getDocumentNo(docId) {
  const { documentno } = await graphQLClient.request(
    gql`
      query getDocumentNo($branch: String) {
        documentno(branch: $branch) {
          doc_id
          doc_invoice
          doc_cinvoice
          doc_purchase
          doc_receipt
          doc_payment
          doc_purchaseother
          doc_invoiceother
          doc_potfr
          doc_abbre
          doc_trans
          doc_adjust
          doc_branch
        }
      }
    `,
    { branch }
  );
  return documentno;
}

export function useDocumentNo() {
  const [docId, setDocId] = useState('');

  const fallback = [];
  const { data: documentno = fallback } = useQuery({
    queryKey: [queryKeys.documentno, docId],
    queryFn: () => getDocumentNo(docId),
  });

  return { documentno, setDocId };
}
