import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import { format } from 'date-fns';
import BigNumber from 'bignumber.js';

import web3 from 'web3';
import { UserSnapshotContext } from './../../context/UserSnapshot';

const columns = [
  { id: 'blockNumber', label: 'Block Number', minWidth: 100, align: 'center' },
  { id: 'day', label: 'Day', minWidth: 170, align: 'center' },
  {
    id: 'xioBalance',
    label: 'XIO Balance',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString('en-US'),
  },
  {
    id: 'xioAppBalance',
    label: 'Balance in Flash protocol',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString('en-US'),
  },
  {
    id: 'xioAppBalance2',
    label: 'Balance in Flash protocol v2',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'uniBalance',
    label: 'Balance in Uniswap',
    minWidth: 170,
    align: 'center',
    format: value => value.toFixed(2),
  },
  {
    id: 'aquaPrice',
    label: 'Aqua per day',
    minWidth: 170,
    align: 'center',
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 640,
    // marginTop: 150,
  },
  tableHeadCell: {
    backgroundColor: '#000000',
    color: '#D89C74',
    border: 'none',
  },
  tableBodyCell: {
    backgroundColor: '#171717',
    color: '#ffffff',
    border: 'none',
  },
  tablePagination: {
    backgroundColor: '#171717',
    color: '#ffffff',
    fill: '#ffffff',
    '& svg.MuiSelect-icon': {
      color: '#fff',
    },
  },
});

export default function StickyHeadTable() {
  const { userSnapshot } = useContext(UserSnapshotContext);

  const classes = useStyles();
  const history = useHistory();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);

  //const [ap, setAp] = useState(0);
  let ap = 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    (async () => {
      if (userSnapshot) {
        let snapshots = [...userSnapshot?.data?.balances];
        console.log(snapshots);
        const newSnapshots = formatSnapshotBalance(snapshots);

        setRows(sortSnapshot(newSnapshots));
      }
    })();
  }, [userSnapshot, history]);

  function sortSnapshot(snapshots) {
    return snapshots.sort((a, b) => {
      return b.blockNumber - a.blockNumber;
    });
  }

  function formatSnapshotBalance(snapshots) {
    return snapshots.map(snapshot => {
      return {
        ...snapshot,
        xioBalance: parseFloat(web3.utils.fromWei(snapshot.xioBalance)).toFixed(2),
        xioAppBalance: parseFloat(web3.utils.fromWei(snapshot.xioAppBalance)).toFixed(2),
        uniBalance: parseFloat(web3.utils.fromWei(snapshot.uniBalance)).toFixed(2),
        xioAppBalance2: parseFloat(web3.utils.fromWei(snapshot.xioAppBalance2)).toFixed(2),
      };
    });
  }

  //12149961

  const findAquaPrice = ({
    timestamp,
    uniBalance,
    xioAppBalance,
    xioAppBalance2,
    xioBalance,
    blockNumber,
  }) => {
    let xioApp;
    let uniswap;
    const month = new Date(timestamp * 1000).getMonth();
    //1612067200 timestamp of Jan 31
    if (timestamp > 1612067200) {
      uniswap = new BigNumber(100 / Math.pow(2, month));
      xioApp = new BigNumber(25 / Math.pow(2, month));
    } else {
      uniswap = new BigNumber(100);
      xioApp = new BigNumber(25);
    }

    if (blockNumber === 12149961) {
      uniswap = uniswap.multipliedBy(2);
      xioApp = xioApp.multipliedBy(2);
    }

    const uniswapPrice = uniswap.multipliedBy(uniBalance).dividedBy(100);
    const xioAppPrice = xioApp.multipliedBy(xioAppBalance).dividedBy(100);
    const xioAppPricev2 = xioApp.multipliedBy(xioAppBalance2).dividedBy(100);
    const xioPrice = xioApp.multipliedBy(xioBalance).dividedBy(100);

    const aquaPrice = uniswapPrice.plus(xioAppPrice).plus(xioAppPricev2).plus(xioPrice).toString();
    ap = new BigNumber(ap).plus(aquaPrice);
    console.log(ap.toString());
    return aquaPrice;
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead className={classes.tableHead}>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  //style={{ minWidth: column.minWidth }}
                  className={classes.tableHeadCell}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
            {rows.map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.timestamp}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={classes.tableBodyCell}
                      >
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : column.id === 'day'
                          ? row['blockNumber'] === 12149961
                            ? `${value}-${format(new Date(1617115051 * 1000), 'MMM')}`
                            : `${value}-${format(new Date(row['timestamp'] * 1000), 'MMM')}`
                          : column.id === 'aquaPrice'
                          ? findAquaPrice(row)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        className={classes.tablePagination}
      />
    </Paper>
  );
}
