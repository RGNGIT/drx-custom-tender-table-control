import { ITenderRow } from './tender-table.model';

const MOCK_DATA: ITenderRow[] = [
  {
    CommercialOfferId: 171,
    Number: '0015',
    Counterparty: 'ЦВД',
    FinalAmount: '90,00',
    DiscountPercentage: '-10',
    DeferralCondition: 'Тестовое условие',
    Comment: '',
    ForWinner: '1',
    WinnerDetails: 'Сидоров С.',
    ForAltWinner: '1',
    AltWinnerDetails: 'Петров П.',
    Decision: 'Альтернативный'
  },
  {
    CommercialOfferId: 174,
    Number: '0016',
    Counterparty: 'ЦВД',
    FinalAmount: '1,00',
    DiscountPercentage: '0',
    DeferralCondition: 'Тестовое условие',
    Comment: '123412'
  },
  {
    CommercialOfferId: 177,
    Number: '0017',
    Counterparty: 'ЦВД',
    FinalAmount: '1,00',
    DiscountPercentage: '0',
    DeferralCondition: 'Тестовое условие',
    ForWinner: '1',
    WinnerDetails: 'Петров П.; Тето К.; Хатсуне М.; Шигихара Л',
    ForAltWinner: '1',
    AltWinnerDetails: 'Сидоров С.',
    Decision: 'Победитель'
  },
  {
    CommercialOfferId: 131,
    Number: '0014',
    Counterparty: 'ЦВД',
    FinalAmount: '1,00',
    DiscountPercentage: '0',
    DeferralCondition: 'Тестовое условие'
  }
];

interface IODataStringResponse {
  '@odata.context': string;
  value: string;
}

export async function fetchTenderProtocol(apiUrl?: string, assignmentId?: number | null, signal?: AbortSignal): Promise<ITenderRow[]> {
  if (!apiUrl || assignmentId === undefined || assignmentId === null) {
    return MOCK_DATA;
  }

  const url = apiUrl.replace('{assignmentId}', String(assignmentId));

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal
    });

    if (!response.ok) {
      throw new Error(`Запрос к внешней системе завершился ошибкой: ${response.status} ${response.statusText}`);
    }

    const odataResponse = await response.json() as IODataStringResponse;
    return JSON.parse(odataResponse.value) as ITenderRow[];
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      throw error;
    }
    console.warn('Не удалось получить данные протокола от внешней системы, использованы моковые данные.', error);
    return [];
  }
}

export default fetchTenderProtocol;
