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

async function addPayable(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddPayable(
        $ap_pono: String
        $ap_podate: Date
        $ap_invno: String
        $ap_invdate: Date
        $ap_recdate: Date
        $ap_suppno: String
        $ap_supplier: String
        $ap_type: String
        $ap_subtotal_amt: Float
        $ap_nettotal_amt: Float
        $ap_paid_amt: Float
        $ap_disc_amt: Float
        $ap_disc_taken: Float
        $ap_dc: String
        $ap_acc: String
        $ap_paid: Boolean
        $ap_balance: Float
        $ap_branch: String
        $ap_glcode: String
        $ap_paid_disc: Float
      ) {
        addPayable(
          ap_pono: $ap_pono
          ap_podate: $ap_podate
          ap_invno: $ap_invno
          ap_invdate: $ap_invdate
          ap_recdate: $ap_recdate
          ap_suppno: $ap_suppno
          ap_supplier: $ap_supplier
          ap_type: $ap_type
          ap_subtotal_amt: $ap_subtotal_amt
          ap_nettotal_amt: $ap_nettotal_amt
          ap_paid_amt: $ap_paid_amt
          ap_disc_amt: $ap_disc_amt
          ap_disc_taken: $ap_disc_taken
          ap_dc: $ap_dc
          ap_acc: $ap_acc
          ap_paid: $ap_paid
          ap_balance: $ap_balance
          ap_branch: $ap_branch
          ap_glcode: $ap_glcode
          ap_paid_disc: $ap_paid_disc
        ) {
          ap_pono
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddPayable(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addPayable(data),
    onSuccess: () => {
      Toast({
        title: 'New Payable being added!',
        status: 'success',
        customId: 'payableAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Payable Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'payableAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('payable');
    },
  });

  return mutate;
}
