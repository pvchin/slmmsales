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

async function addReceivable(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddReceivable(
        $ar_invno: String
        $ar_date: Date
        $ar_custno: String
        $ar_cust: String
        $ar_type: String
        $ar_subtotal: Float
        $ar_paid_amt: Float
        $ar_disc_amt: Float
        $ar_disc_taken: Float
        $ar_balance: Float
        $ar_total: Float
        $ar_branch: String
        $ar_paid: Boolean
        $ar_glcode: String
        $ar_paid_disc: Float
      ) {
        addReceivable(
          ar_invno: $ar_invno
          ar_date: $ar_date
          ar_custno: $ar_custno
          ar_cust: $ar_cust
          ar_type: $ar_type
          ar_subtotal: $ar_subtotal
          ar_paid_amt: $ar_paid_amt
          ar_disc_amt: $ar_disc_amt
          ar_disc_taken: $ar_disc_taken
          ar_balance: $ar_balance
          ar_total: $ar_total
          ar_branch: $ar_branch
          ar_paid: $ar_paid
          ar_glcode: $ar_glcode
          ar_paid_disc: $ar_paid_disc
        ) {
          ar_invno
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddReceivable(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addReceivable(data),
    onSuccess: () => {
      Toast({
        title: 'New Receivable being added!',
        status: 'success',
        customId: 'recAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Receivable Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'recAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receivable');
    },
  });

  return mutate;
}
