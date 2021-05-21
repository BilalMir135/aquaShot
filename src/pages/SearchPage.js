import React from 'react';
import { Container, makeStyles, useMediaQuery } from '@material-ui/core';

import SearchBar from './../components/SearchBar';
import blockzerologo from './../assets/blockzero.png';

const useStyle = makeStyles({
  searchContainer: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

function SearchPage() {
  const classes = useStyle();

  const tablet = useMediaQuery('(min-width:768px)');

  return (
    <Container className={classes.searchContainer}>
      {!tablet ? (
        <img src={blockzerologo} style={{ width: 200, marginBottom: 40 }} alt='Blockzero Logo' />
      ) : (
        <img src={blockzerologo} style={{ width: 350, marginBottom: 40 }} alt='Blockzero Logo' />
      )}
      <SearchBar />
    </Container>
  );
}

export default SearchPage;
