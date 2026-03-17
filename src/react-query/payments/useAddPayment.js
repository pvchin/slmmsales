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

async function addPayment(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddPayment(
        $pay_no: String
        $pay_date: Date
        $pay_bank: String
        $pay_refno: String
        $pay_remark: String
        $pay_suppno: String
        $pay_supplier: String
        $pay_total: Float
        $pay_disc: Float
        $pay_nettotal: Float
        $pay_post: String
        $pay_glcode: String
        $pay_branch: String
        $pay_glname: String
      ) {
        addPayment(
          pay_no: $pay_no
          pay_date: $pay_date
          pay_bank: $pay_bank
          pay_refno: $pay_refno
          pay_remark: $pay_remark
          pay_suppno: $pay_suppno
          pay_supplier: $pay_supplier
          pay_total: $pay_total
          pay_disc: $pay_disc
          pay_nettotal: $pay_nettotal
          pay_post: $pay_post
          pay_glcode: $pay_glcode
          pay_branch: $pay_branch
          pay_glname: $pay_glname
        ) {
          pay_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddPayment(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addPayment(data),
    onSuccess: () => {
      Toast({
        title: 'New Payment being added!',
        status: 'success',
        customId: 'payAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Payment Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'payAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('payments');
    },
  });

  return mutate;
}
