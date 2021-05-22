import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, InputBase, IconButton, useMediaQuery } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { validateAccountAddress } from "./../../utils/validators/validators";
import axios from "axios";
import { UserSnapshotContext } from "./../../context/UserSnapshot";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    width: "40%",
    backgroundColor: "#000000",
  },
  rootMobile: {
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#000000",
  },
  input: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: "#ffffff",
    fontSize: "1.2rem",
  },
  iconButton: {
    padding: 10,
    color: "#696969",
  },
  iconButtonDisabled: {
    padding: 10,
    color: "#69696980 !important",
  },
  // divider: {
  //   height: 28,
  //   width: 2,
  //   margin: 4,
  //   backgroundColor: '#696969'
  // },
}));

function SearchBar() {
  const { updateSnapshot } = useContext(UserSnapshotContext);

  const classes = useStyles();
  const history = useHistory();
  const tablet = useMediaQuery("(min-width:768px)");

  const [accountAddress, setAccountAddress] = useState();
  const [validAccountAddress, setValidAccountAddress] = useState(false);

  function handleInput(event) {
    setAccountAddress(event.target.value);

    const { valid } = validateAccountAddress(event.target.value);

    if (valid) {
      setValidAccountAddress(true);
    } else if (!valid) {
      setValidAccountAddress(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const res = await axios({
        method: "GET",
        url: `https://server2.flashstake.io/aqua/${accountAddress}`,
      });

      if (res.status === 200) {
        // console.log(res);
        updateSnapshot(res?.data);
        history.push(`/account/${accountAddress}`);
      } else {
        console.log("Could not find the account");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Paper
      elevation={3}
      component="form"
      className={tablet ? classes.root : classes.rootMobile}
    >
      <InputBase
        className={classes.input}
        placeholder="Enter Account Address"
        inputProps={{ "aria-label": "enter account address" }}
        onChange={(event) => handleInput(event)}
        value={accountAddress}
      />
      <IconButton
        type="submit"
        className={
          !validAccountAddress ? classes.iconButtonDisabled : classes.iconButton
        }
        aria-label="search"
        disabled={!validAccountAddress}
        onClick={(event) => handleSubmit(event)}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
