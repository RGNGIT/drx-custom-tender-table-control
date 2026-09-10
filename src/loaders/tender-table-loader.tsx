import * as React from 'react'
import { createRoot } from 'react-dom/client';
import {
  ControlCleanupCallback,
  ILoaderArgs,
  IRemoteComponentCardApi,
} from '@directum/sungero-remote-component-types';
import TenderTable from '../controls/tender-table/TenderTable';
import Properties from "../../properties.tender-table"

export default (args: ILoaderArgs): Promise<ControlCleanupCallback> => {
  const root = createRoot(args.container);
  root.render(<TenderTable
    label={Properties.label}
    context={args.initialContext}
    apiUrl={Properties.apiUrl}
    api={args.api as IRemoteComponentCardApi} />);
  return Promise.resolve(() => root.unmount());
}
