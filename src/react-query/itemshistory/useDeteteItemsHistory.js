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

async function deleteItemsHistory(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteItemHistory($it_transno: String) {
        deleteItemHistory(it_transno: $it_transno) {
          it_transno
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteItemsHistory(data) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: data => deleteItemsHistory(data),
    onSuccess: () => {
      Toast({
        title: 'Item history being deleted!',
        status: 'warning',
        customId: 'itemhistDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Items History Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'itemhistDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemshistory');
    },
  });

  return mutate;
}
