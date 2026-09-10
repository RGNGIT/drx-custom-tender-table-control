import * as React from 'react'
import { createRoot } from 'react-dom/client';
import {
  ControlCleanupCallback,
  ILoaderArgs,
  IRemoteComponentCardApi,
} from '@directum/sungero-remote-component-types';
import BaseInput from '../controls/base-input/BaseInput';
import Properties from "../../properties"

export default (args: ILoaderArgs): Promise<ControlCleanupCallback> => {
  const root = createRoot(args.container);
  console.log('root render', args.api)
  root.render(<BaseInput 
    label={Properties.label} 
    context={args.initialContext}
    propertyName={Properties.propertyName} 
    customPropertyContainer={Properties.customPropertyContainer} 
    api={args.api as IRemoteComponentCardApi}/>);
  return Promise.resolve(() => root.unmount());
}
