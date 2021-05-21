import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  makeStyles,
  Box,
  Typography,
  LinearProgress,
  useMediaQuery,
} from '@material-ui/core';
import { UserSnapshotContext } from './../context/UserSnapshot';
import SnapshotTable from './../components/SnapshotTable';
import web3 from 'web3';
import axios from 'axios';

const useStyle = makeStyles({
  searchContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '50px 10px !important',
  },
  headingWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 40,
  },
  someClass: {
    display: 'inline-block',
    backgroundColor: '#D89C74',
    color: '#121212',
    padding: '5px 10px',
  },
  heading: {
    color: '#D89C74',
    margin: 5,
  },
  linerProgress: {
    width: 300,
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#D89C74',
    },
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: '#121212',
      height: 2,
    },
  },
});

function UserSnapshotPage() {
  const { userSnapshot, updateSnapshot } = useContext(UserSnapshotContext);

  const { accountAddress: accAddress } = useParams();

  const classes = useStyle();

  const mobile = useMediaQuery('(min-width:320px)');
  const tablet = useMediaQuery('(min-width:768px)');

  const [accountAddress, setAccountAddress] = useState();
  const [accountBalance, setAccountBalance] = useState();

  useEffect(() => {
    (async () => {
      if (userSnapshot) {
        if (mobile)
          setAccountAddress(
            `${(userSnapshot?.data?.address).substring(
              0,
              3
            )}...${(userSnapshot?.data?.address).substring(
              (userSnapshot?.data?.address).length - 10,
              (userSnapshot?.data?.address).length
            )}`
          );
        if (tablet) setAccountAddress(userSnapshot?.data?.address);
        // setAccountAddress(userSnapshot?.data?.address);
        setAccountBalance(parseFloat(web3.utils.fromWei(userSnapshot?.data?.amount)).toFixed(2));
      } else {
        const snapshots = await getUserSnapshot(accAddress);
        updateSnapshot(snapshots);
      }
    })();
  }, [userSnapshot, accAddress, updateSnapshot, mobile, tablet]);

  async function getUserSnapshot(accountAddress) {
    try {
      const res = await axios({
        method: 'GET',
        url: `https://server.xio.app:3030/user/${accountAddress}`,
      });

      if (res.status === 200) {
        return res?.data;
      } else return null;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container className={classes.searchContainer} maxWidth='lg'>
      {userSnapshot ? (
        <>
          {!tablet ? (
            <>
              <Box className={classes.headingWrapper}>
                <Typography variant='body2' component='body2' className={classes.heading}>
                  Account Address: <Box className={classes.someClass}>{accountAddress}</Box>
                </Typography>
                <Typography variant='body2' component='body2' className={classes.heading}>
                  Account Balance: <Box className={classes.someClass}>{accountBalance}</Box>
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box className={classes.headingWrapper}>
                <Typography variant='h6' component='h6' className={classes.heading}>
                  Account Address: <Box className={classes.someClass}>{accountAddress}</Box>
                </Typography>
                <Typography variant='h6' component='h6' className={classes.heading}>
                  Account Balance: <Box className={classes.someClass}>{accountBalance}</Box>
                </Typography>
              </Box>
            </>
          )}
          <SnapshotTable />
        </>
      ) : (
        <Box className={classes.linerProgress}>
          <LinearProgress color='primary' />
        </Box>
      )}
    </Container>
  );
}

export default UserSnapshotPage;
