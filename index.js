import api from './host-api-stub';
import context from './host-context-stub';
import loadApp from './src/loaders/tender-table-loader';

let args = {
  container: document.getElementById('app'),
  initialContext: context,
  api: api,
  controlInfo: null
}

loadApp(args);
