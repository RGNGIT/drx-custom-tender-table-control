import { IRemoteComponentCardApi, IRemoteComponentContext } from "@directum/sungero-remote-component-types";

export interface IBaseInputProps {
  api: IRemoteComponentCardApi
  context: IRemoteComponentContext
  label: string;
  propertyName: string;
  value?: string;
  customPropertyContainer: string;
}

export interface IBaseInputModel {
  changeProperty(propName: string, prop: Object): void
  [key: string]: any;
}