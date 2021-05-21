import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import SearchPage from './pages/SearchPage';
import UserSnapshotPage from './pages/UserSnapshotPage';
import { UserSnapshotProvider } from './context/UserSnapshot';

function App() {
  return (
    <UserSnapshotProvider>
      <BrowserRouter>
        <Switch>
          <Route
            path="/search">
            <SearchPage />
          </Route>
          <Route
            path="/account/:accountAddress">
            <UserSnapshotPage />
          </Route>
          <Redirect to="/search" />
        </Switch>
      </BrowserRouter>
    </UserSnapshotProvider>
  );
}

export default App;
