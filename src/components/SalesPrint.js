import React from 'react';
import {
  Canvas,
  Text,
  View,
  Page,
  Document,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { TiArrowBack } from 'react-icons/ti';
import invoice from '../data/invoice';
import logo from '../assets/logo.png';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import {
  salesState,
  salesdetlsState,
  editSalesIdState,
  editSalesDetlsIdState,
} from '../data/atomdata';

const borderColor = 'white';
//const borderColor = '#90e5fc';
const tableRowsCount = 13;

const InvoiceTitle = ({ title }) => (
  <View style={titlestyles.titleContainer}>
    <Text style={titlestyles.reportTitle}>{title}</Text>
  </View>
);

const InvoiceNo = ({ invoice }) => (
  <>
    <View style={docnostyles.invoiceNoContainer}>
      <Text style={docnostyles.label}>Invoice No:</Text>
      <Text style={docnostyles.invoiceDate}>{invoice.invoice_no}</Text>
    </View>
    <View style={docnostyles.invoiceDateContainer}>
      <Text style={docnostyles.label}>Date: </Text>
      <Text>{invoice.trans_date}</Text>
    </View>
  </>
);
const BillTo = ({ invoice, pageno, totalpage }) => (
  <View style={headerstyles.colContainer}>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtolabel}>Bill To:</Text>
      <Text style={headerstyles.doclabel}>Invoice No:</Text>
      <Text style={headerstyles.docfield}>{invoice.sls_no}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.sls_cust}</Text>
      <Text style={headerstyles.doclabel}>Invoice Date:</Text>
      <Text style={headerstyles.docfield}>{invoice.sls_date}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.sls_add1}</Text>
      <Text style={headerstyles.doclabel}>Your Ref No:</Text>
      <Text style={headerstyles.docfield}>{invoice.sls_yref}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.sls_add2}</Text>
      <Text style={headerstyles.doclabel}>Our Ref No:</Text>
      <Text style={headerstyles.docfield}>{invoice.sls_oref}</Text>
    </View>
    <View style={headerstyles.rowContainer}>
      <Text style={headerstyles.billtofield}>{invoice.sls_add3}</Text>
      <Text style={headerstyles.doclabel}>Page No:</Text>
      <Text style={headerstyles.docfield}>
        {pageno} / {totalpage}
      </Text>
    </View>
    <Text style={headerstyles.billtofield}>{invoice.sls_add4}</Text>
  </View>
);

const InvoiceTableHeader = () => (
  <View style={tablestyles.container}>
    <Text style={tablestyles.itemno}>Item No</Text>
    <Text style={tablestyles.description}>Item Description</Text>
    <Text style={tablestyles.qty}>Qty</Text>
    <Text style={tablestyles.rate}>Price</Text>
    <Text style={tablestyles.amount}>Amount</Text>
  </View>
);

const InvoiceTableRow = ({ items }) => {
  const rows = items.map((item, index) => (
    <View style={tablerowstyles.row} key={item.sld_id.toString()}>
      <Text
        style={tablerowstyles.itemno}
        break={index % 12 === 0 ? true : false}
      >
        {item.sld_itemno}
      </Text>
      <Text style={tablerowstyles.description}>{item.sld_desp}</Text>
      <Text style={tablerowstyles.qty}>{item.sld_qty}</Text>
      <Text style={tablerowstyles.rate}>{item.sld_price}</Text>
      <Text style={tablerowstyles.amount}>{item.sld_total.toFixed(2)}</Text>
    </View>
  ));
  return <>{rows}</>;
};

const InvoiceTableBlankSpace = ({ rowsCount }) => {
  const blankRows = Array(rowsCount).fill(0);
  const rows = blankRows.map((x, i) => (
    <View style={tablerowblankstyles.row} key={`BR${i}`}>
      <Text style={tablerowblankstyles.itemno}>-</Text>
      <Text style={tablerowblankstyles.description}>-</Text>
      <Text style={tablerowblankstyles.qty}>-</Text>
      <Text style={tablerowblankstyles.rate}>-</Text>
      <Text style={tablerowblankstyles.amount}>-</Text>
    </View>
  ));
  return <>{rows}</>;
};

const InvoiceTableFooter = ({ total }) => {
  // const total = items
  //   .map(item => item.sld_total)
  //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={tablefooterstyles.row}>
      <Text style={tablefooterstyles.description}>TOTAL</Text>
      <Text style={tablefooterstyles.total}>
        {Number.parseFloat(total).toFixed(2)}
      </Text>
    </View>
  );
};

const InvoiceItemsTable = ({ items, total, lastpage }) => (
  <View style={itemsstyles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow items={items} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount - items.length} />
    {lastpage ? <InvoiceTableFooter total={total} /> : null}
  </View>
);

const InvoiceThankYouMsg = () => (
  <View style={msgstyles.titleContainer}>
    <Text style={msgstyles.reportTitle}>Thank you for your business</Text>
  </View>
);

const InvoiceFooter = () => (
  <View>
    <View style={footerstyles.lineContainer}>
      <Text style={footerstyles.leftText}>______________________</Text>
      <Text style={footerstyles.rightText}>_____________________</Text>
    </View>
    <View style={footerstyles.titleContainer}>
      <Text style={footerstyles.leftText}>ISSUED BY</Text>
      <Text style={footerstyles.rightText}>RECEIVED BY</Text>
    </View>
  </View>
);

// Create Document Component
const InvoicePrint = () => {
  const navigate = useNavigate();
  const [batch, setBatch] = useRecoilState(salesState);
  const [batchdetls, setBatchdetls] = useRecoilState(salesdetlsState);

  const detlsdata = _.chunk(batchdetls, tableRowsCount);

  return (
    <Box
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //align="left"
        //alignItems="flex-start"
      >
        <HStack py={2} spacing="3">
          <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
            <GridItem colSpan={1}>
              <Button
                leftIcon={<TiArrowBack size={30} />}
                onClick={() => navigate(-1)}
                colorScheme="teal"
              >
                Back
              </Button>
            </GridItem>
          </Grid>
        </HStack>
        <PDFViewer
          width="1000"
          height="800"
          style={{ display: 'table', margin: '0 auto' }}
        >
          <Document>
            {detlsdata.map((x, index) => {
              console.log('chunk print', index, detlsdata.length);
              return (
                <Page size="A4" style={docstyles.page} key={index}>
                  <Image style={docstyles.logo} src={logo} />
                  <InvoiceTitle title={batch.sls_type} />
                  <BillTo
                    invoice={batch}
                    pageno={index + 1}
                    totalpage={detlsdata.length}
                  />

                  <InvoiceItemsTable
                    items={x}
                    total={batch.sls_total}
                    lastpage={detlsdata.length - 1 === index}
                  />

                  <InvoiceThankYouMsg />
                  {detlsdata.length - 1 === index ? <InvoiceFooter /> : null}
                </Page>
              );
            })}
            )
          </Document>
        </PDFViewer>
      </VStack>
    </Box>
  );
};

const docstyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
const titlestyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    //marginRight: 20,

    justifyContent: 'flex-end',
  },
  reportTitle: {
    //color: '#61dafb',
    color: 'black',
    letterSpacing: 4,
    fontSize: 25,
    fontWeight: 'blod',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '35%',
    //borderWidth: '1px solid black',
    paddingTop: '10',
    paddingBottom: '0',
    fontFamily: 'Helvetica-Bold',
  },
  blankfield: {
    width: '65%',
  },
});

const docnostyles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: 'row',
    marginTop: 23,
    justifyContent: 'flex-end',
  },
  invoiceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: 'bold',
  },
  label: {
    width: 60,
  },
});

const billtostyles = StyleSheet.create({
  headerContainer: {
    marginTop: 36,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    fontFamily: 'Helvetica-Oblique',
  },
});

const headerstyles = StyleSheet.create({
  colContainer: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  invoiceNoContainer: {
    flexDirection: 'row',
    //marginTop: 26,
    justifyContent: 'flex-end',
  },
  billtolabel: {
    fontWeight: 'blod',
    width: '65%',
  },
  billtofield: {
    width: '65%',
  },
  doclabel: {
    fontWeight: 'blod',
    width: '15%',
  },
  docfield: {
    width: '20%',
  },
});

const itemsstyles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#bff0fd',
  },
});

const tablestyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopColor: 'grey',
    borderTopWidth: 1,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    //backgroundColor: '#bff0fd',
    backgroundColor: 'lightgrey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  itemno: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  description: {
    width: '45%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

const tablerowstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  itemno: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  description: {
    width: '45%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

const tablerowblankstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
    color: 'white',
  },
  itemno: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  description: {
    width: '45%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: '15%',
  },
});

const tablefooterstyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderTopColor: 'grey',
    borderTopWidth: 2,
    //borderBottomColor: '#bff0fd',
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    fontStyle: 'bold',
    paddingTop: 2,
  },
  description: {
    width: '85%',
    textAlign: 'right',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

const msgstyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  reportTitle: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

const footerstyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  lineContainer: {
    flexDirection: 'row',
    marginTop: 60,
  },
  line: {
    fontSize: 12,
    textAlign: 'center',
  },
  leftText: {
    fontSize: 12,
    textAlign: 'left',
    textTransform: 'uppercase',
    justifyContent: 'flex-start',
    width: '60%',
  },
  rightText: {
    fontSize: 12,
    textAlign: 'left',
    textTransform: 'uppercase',
    //justifyContent: 'flex-end',
    width: '30%',
  },
});

export default InvoicePrint;
