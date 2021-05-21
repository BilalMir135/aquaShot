import React, { createContext, useState } from 'react';


const UserSnapshotContext = createContext({
  userSnapshot: null,
  updateSnapshot: (data) => { },
})


function UserSnapshotProvider(props) {
  const [userSnapshot, setUserSnapshot] = useState();

  function updateSnapshot(data) {
    setUserSnapshot(data);
  }

  return (
    <UserSnapshotContext.Provider
      value={{ userSnapshot: userSnapshot, updateSnapshot }}
      {...props}
    />
  )
}

export { UserSnapshotContext, UserSnapshotProvider };