import React, { useEffect } from 'react';
import { useItemsOnhand } from '../react-query/itemsonhand/useItemsOnhand';
import { useUpdateItemsOnhand } from '../react-query/itemsonhand/useUpdateItemsOnhand';

export const UpdateItemsOnHand = ({ itemno, branch, qty, type }) => {
  const { itemsonhand } = useItemsOnhand();
  const updateItemsOnhand = useUpdateItemsOnhand();

  useEffect(() => {}, [itemno]);
};
