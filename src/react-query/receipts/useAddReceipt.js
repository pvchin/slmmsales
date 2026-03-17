import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function addReceipt(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddReceipt(
        $rcp_no: String
        $rcp_date: Date
        $rcp_bank: String
        $rcp_refno: String
        $rcp_remark: String
        $rcp_custno: String
        $rcp_customer: String
        $rcp_total: Float
        $rcp_disc: Float
        $rcp_nettotal: Float
        $rcp_post: String
        $rcp_branch: String
      ) {
        addReceipt(
          rcp_no: $rcp_no
          rcp_date: $rcp_date
          rcp_bank: $rcp_bank
          rcp_refno: $rcp_refno
          rcp_remark: $rcp_remark
          rcp_custno: $rcp_custno
          rcp_customer: $rcp_customer
          rcp_total: $rcp_total
          rcp_disc: $rcp_disc
          rcp_nettotal: $rcp_nettotal
          rcp_post: $rcp_post
          rcp_branch: $rcp_branch
        ) {
          rcp_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddReceipt(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addReceipt(data),
    onSuccess: () => {
      Toast({
        title: 'New Receipt being added!',
        status: 'success',
        customId: 'reptAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Receipt Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'reptAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receipts');
    },
  });

  return mutate;
}
