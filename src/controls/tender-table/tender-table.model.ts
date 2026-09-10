import { IRemoteComponentCardApi, IRemoteComponentContext } from "@directum/sungero-remote-component-types";

export interface ITenderTableProps {
  api: IRemoteComponentCardApi;
  context: IRemoteComponentContext;
  label?: string;
  apiUrl?: string;
}

export interface ITenderRow {
  CommercialOfferId: number;
  Number: string;
  Counterparty: string;
  FinalAmount: string;
  DiscountPercentage: string;
  DeferralCondition: string;
  Comment?: string;
  ForWinner?: string;
  WinnerDetails?: string;
  ForAltWinner?: string;
  AltWinnerDetails?: string;
  Decision?: string;
}
