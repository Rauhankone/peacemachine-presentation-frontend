import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Input from './InputView';
import Director from './DirectorView';
import Presentation from './PresentationView';
import NotFound from './NotFound';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/input" component={Input} />
      <Route exact path="/director" component={Director} />
      <Route exact path="/presentation" component={Presentation} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);
