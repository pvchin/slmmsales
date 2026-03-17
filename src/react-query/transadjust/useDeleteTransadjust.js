import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
//import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteTranadjust(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranadjust($ta_id: ID) {
        deleteTranadjust(ta_id: $ta_id) {
          ta_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTransadjust(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranadjust(data),
    onSuccess: () => {
      queryClient.invalidateQueries('tranadjust');
      Toast({
        title: 'Adjust Transaction being deleted!',
        status: 'warning',
        customId: 'tranadjustDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Adjust Transaction Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'tranadjustDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transadjust');
    },
  });

  return mutate;
}
