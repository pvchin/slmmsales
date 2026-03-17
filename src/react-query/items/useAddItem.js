import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

const paramdata = {
  stkno: 'S12',
  desp: 'Sprite Test 2',
  dept: 'S',
  cat: 'C',
  pack: '12',
  unit: 'Pc',
  brand: 'S',
  wsp: 3.0,
  factor: 1,
  qty: 0,
};

async function addItem(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddItem(
        $item_no: String
        $item_group: String
        $item_desp: String
        $item_packing: String
        $item_category: String
        $item_unit: String
        $item_brand: String
        $item_qtyhand: Float
        $item_pfactor: Float
        $item_ucost_pc: Float
        $item_ucost_ctn: Float
        $item_uprice_pc: Float
        $item_uprice_ctn: Float
        $item_offerprice: Float
        $item_supplier: String
        $item_bfqty: Float
        $item_bfamt: Float
        $item_minlvlqty: Float
        $item_last_puramt: Float
        $item_last_recqty: Float
        $item_lock: Boolean
        $item_remark: String
        $item_lastucost: Float
        $item_smcode: String
        $item_coolprice_pc: Float
        $item_package: Boolean
        $item_lastrecdate: String
        $item_onopo: String
        $item_onoqty: Float
        $item_warehouse: Boolean
        $item_type: String
        $item_nonstock: Boolean
        $item_location: String
        $item_prtreptlabel: Boolean
      ) {
        addItem(
          item_no: $item_no
          item_group: $item_group
          item_desp: $item_desp
          item_packing: $item_packing
          item_category: $item_category
          item_unit: $item_unit
          item_brand: $item_brand
          item_qtyhand: $item_qtyhand
          item_pfactor: $item_pfactor
          item_ucost_pc: $item_ucost_pc
          item_ucost_ctn: $item_ucost_ctn
          item_uprice_pc: $item_uprice_pc
          item_uprice_ctn: $item_uprice_ctn
          item_offerprice: $item_offerprice
          item_supplier: $item_supplier
          item_bfqty: $item_bfqty
          item_bfamt: $item_bfamt
          item_minlvlqty: $item_minlvlqty
          item_last_puramt: $item_last_puramt
          item_last_recqty: $item_last_recqty
          item_lock: $item_lock
          item_remark: $item_remark
          item_lastucost: $item_lastucost
          item_smcode: $item_smcode
          item_coolprice_pc: $item_coolprice_pc
          item_package: $item_package
          item_lastrecdate: $item_lastrecdate
          item_onopo: $item_onopo
          item_onoqty: $item_onoqty
          item_warehouse: $item_warehouse
          item_type: $item_type
          item_nonstock: $item_nonstock
          item_location: $item_location
          item_prtreptlabel: $item_prtreptlabel
        ) {
          item_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddItem(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addItem(data),
    onSuccess: () => {
      Toast({
        title: 'New item being added!',
        status: 'success',
        customId: 'itemAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Item Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'itemAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('items');
    },
  });

  return mutate;
}
