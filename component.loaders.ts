import { IRemoteControlLoader } from '@directum/sungero-remote-component-types';
import * as TenderTableLoader from './src/loaders/tender-table-loader';

// Загрузчики контролов компонента.
const loaders: Record<string, IRemoteControlLoader> = {
  'tender-table-loader': TenderTableLoader
};

export default loaders;
