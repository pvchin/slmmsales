import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function updateDocumentno(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateDocumentno(
        $doc_id: ID
        $doc_invoice: Int
        $doc_cinvoice: Int
        $doc_purchase: Int
        $doc_receipt: Int
        $doc_payment: Int
        $doc_purchaseother: Int
        $doc_invoiceother: Int
        $doc_potfr: Int
        $doc_abbre: String
        $doc_branch: String
      ) {
        updateDocumentno(
          doc_id: $doc_id
          doc_invoice: $doc_invoice
          doc_cinvoice: $doc_cinvoice
          doc_purchase: $doc_purchase
          doc_receipt: $doc_receipt
          doc_payment: $doc_payment
          doc_purchaseother: $doc_purchaseother
          doc_invoiceother: $doc_invoiceother
          doc_potfr: $doc_potfr
          doc_abbre: $doc_abbre
          doc_branch: $doc_branch
        ) {
          doc_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateDocumentno(data) {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const { mutate } = useMutation(data => updateDocumentno(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('documentno');
      toast({
        title: 'Document No being updated!',
        status: 'success',
      });
    },
    onError: () => {
      toast({
        title:
          'Document No Update Error! Please check your internet connection!',
        status: 'warning',
      });
    },
  });

  return mutate;
}
