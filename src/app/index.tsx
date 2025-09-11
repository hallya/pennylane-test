import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import { ApiProvider } from '../api'

import 'bootstrap/dist/css/bootstrap.min.css'

const domRoot = document.getElementById('root');
const root = createRoot(domRoot!);

if (!process.env.REACT_APP_JEAN_TEST_API_TOKEN) {
  throw new Error('REACT_APP_JEAN_TEST_API_TOKEN should be define');
}

root.render(
  <React.StrictMode>
    <ApiProvider
      url="https://jean-test-api.herokuapp.com/"
      token={process.env.REACT_APP_JEAN_TEST_API_TOKEN} // set your api token here
    >
      <App />
    </ApiProvider>
  </React.StrictMode>
)
