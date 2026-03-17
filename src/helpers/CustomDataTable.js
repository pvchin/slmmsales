import React, { useState } from 'react';
import DataTable, { defaultThemes } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
//import { AiOutlinePlus, AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
//import { GrClose, GrAdd, GrSearch } from 'react-icons/gr'
import { CloseIcon, SearchIcon, AddIcon, CheckIcon } from '@chakra-ui/icons';

const customStyles = {
  header: {
    style: {
      minHeight: '56px',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      fontSize: '25px',
      fontWeight: 'bold',
      color: 'green',
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      backgroundColor: '#9AE6B4',
      borderTopColor: defaultThemes.default.divider.default,
      fontSize: '14px',
      fontWeight: 700,
    },
  },
  headCells: {
    //style: { backgroundColor: `#9AE6B4`, fontSize: '14px', fontWeight: 700 },
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  // cells: {
  //   style: {
  //     '&:not(:last-of-type)': {
  //       borderRightStyle: 'solid',
  //       borderRightWidth: '1px',
  //       borderRightColor: defaultThemes.default.divider.default,
  //     },
  //   },
  // },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
};

const conditionalRowStyles = [
  {
    when: row => row.toggleSelected,
    style: {
      backgroundColor: '#c4dedb',
      userSelect: 'none',
    },
  },
];

const CustomDataTable = ({
  title,
  columns,
  filteredData,
  handleAddRec,
  filterText,
  setFilterText,
  filterbyname,
  hideAddRec,
  hideSelectRec = true,
  handleSelectRec,
  handleRowDoubleClick,
  handleRowClick,
  defaultSortFieldId,
  defaultSortAsc,
  selectableRows,
  handleSelectedRowChange,
}) => {
  const [hideAddButton, setHideAddButton] = useState(hideAddRec || false);
  const [hideSelectButton, setHideSelectButton] = useState(hideSelectRec)
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
      <HStack>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
          <Input
            id="search"
            key="search"
            type="text"
            variant="outline"
            autoFocus="autoFocus"
            width="300"
            placeholder={filterbyname ? filterbyname : 'filter by name'}
            aria-label="Search Input"
            value={filterText}
            onChange={row => {
              onFilter(row);
            }}
          />
        </InputGroup>
        <IconButton icon={<CloseIcon />} onClick={onClear} size="md" />
        {!hideAddButton && (
          <IconButton
            icon={<AddIcon />}
            size="md"
            onClick={e => {
              handleAddRec(e);
            }}
          />
        )}
        {!hideSelectButton && (
          <IconButton
            icon={<CheckIcon />}
            size="md"
            onClick={e => {
              handleSelectRec(e);
            }}
          />
        )}
      </HStack>
    </>
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <>
        <Box>
          <FilterComponent
            onFilter={e => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        </Box>
      </>
    );
  }, [filterText, resetPaginationToggle]);
  
  return (
    <>
      <DataTable
        title={title}
        columns={columns}
        data={filteredData}
        pagination
        filter={true}
        defaultSortFieldId={defaultSortFieldId}
        defaultSortAsc={defaultSortAsc ? defaultSortAsc : false}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        fixedHeader
        progressComponent={<div>Loading...</div>}
        customStyles={customStyles}
        onRowDoubleClicked={
          handleRowDoubleClick ? e => handleRowDoubleClick(e) : e => {}
        }
        onRowClicked={handleRowClick ? e => handleRowClick(e) : e => {}}
        selectableRows={selectableRows ? selectableRows : false}
        onSelectedRowsChange={
          handleSelectedRowChange ? e => handleSelectedRowChange(e) : e => {}
        }
        clearSelectedRows={toggledClearRows}
        conditionalRowStyles={conditionalRowStyles}
      />
    </>
  );
};

export default CustomDataTable;
