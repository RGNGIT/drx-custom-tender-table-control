import React, { useState, useId, useEffect, useRef, useCallback } from 'react';
import { ITenderTableProps, ITenderRow } from './tender-table.model';
import { fetchTenderProtocol } from './tenderProtocolApi';
import './tender-table.css';
import { IEntity, Theme } from '@directum/sungero-remote-component-types';

interface IColumn {
  key: keyof ITenderRow;
  title: string;
  width: number;
}

const COLUMNS: IColumn[] = [
  { key: 'Number', title: '№ КП', width: 90 },
  { key: 'Counterparty', title: 'Контрагент', width: 120 },
  { key: 'FinalAmount', title: 'Сумма финальная', width: 140 },
  { key: 'DiscountPercentage', title: 'Процент скидки', width: 120 },
  { key: 'DeferralCondition', title: 'Условие по отсрочке', width: 170 },
  { key: 'Comment', title: 'Комментарий', width: 160 },
  { key: 'ForWinner', title: 'За осн. победителя', width: 140 },
  { key: 'WinnerDetails', title: 'Детализация ОП', width: 150 },
  { key: 'ForAltWinner', title: 'За альт. победителя', width: 140 },
  { key: 'AltWinnerDetails', title: 'Детализация АП', width: 150 },
  { key: 'Decision', title: 'Решение ТК', width: 140 }
];

const MIN_COLUMN_WIDTH = 60;

const getDefaultWidths = (): Record<string, number> => {
  const widths: Record<string, number> = {};
  COLUMNS.forEach((col) => {
    widths[col.key as string] = col.width;
  });
  return widths;
};

const decisionClass = (decision?: string): string => {
  switch (decision) {
    case 'Победитель':
      return 'decision-winner';
    case 'Альтернативный':
      return 'decision-alt';
    default:
      return '';
  }
};

const formatCell = (row: ITenderRow, key: keyof ITenderRow): string => {
  const value = row[key];
  return value === undefined || value === null ? '' : String(value);
};

const TenderTable = (props: ITenderTableProps) => {
  const [rows, setRows] = useState<ITenderRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [widths, setWidths] = useState<Record<string, number>>(getDefaultWidths);

  const uniqueId = `tender-table${useId()}`;
  const isNightTheme = props.context.theme === Theme.Night;
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);
  const entity = props.api.getEntity<IEntity>();
  const assignmentId = entity?.Id;

  useEffect(() => {
    if (isNightTheme) {
      document.body.classList.add('night-theme');
    } else {
      document.body.classList.remove('night-theme');
    }
  }, [isNightTheme]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchTenderProtocol(props.apiUrl, assignmentId, controller.signal)
      .then((data) => setRows(data))
      .catch((err) => {
        if ((err as Error)?.name !== 'AbortError') {
          setError('Не удалось загрузить данные протокола.');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [props.apiUrl, assignmentId]);

  const onRowClick = (row: ITenderRow): void => {
    setSelectedId(row.CommercialOfferId);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    const state = resizingRef.current;
    if (!state) return;
    const delta = e.clientX - state.startX;
    const newWidth = Math.max(MIN_COLUMN_WIDTH, state.startWidth + delta);
    setWidths((prev) => ({ ...prev, [state.key]: newWidth }));
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizingRef.current = null;
    document.body.classList.remove('tender-table-resizing');
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);

  const handleResizeStart = useCallback((key: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = { key, startX: e.clientX, startWidth: widths[key] };
    document.body.classList.add('tender-table-resizing');
    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
  }, [widths, handleResizeMove, handleResizeEnd]);

  useEffect(() => () => {
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeEnd);
    document.body.classList.remove('tender-table-resizing');
  }, [handleResizeMove, handleResizeEnd]);

  const totalWidth = COLUMNS.reduce((sum, col) => sum + (widths[col.key as string] ?? col.width), 0);

  return (
    <div className="tender-table" id={uniqueId}>
      {props.label && <div className="tender-table-label">{props.label}</div>}

      {loading && <div className="tender-table-status">Загрузка данных...</div>}
      {!loading && error && <div className="tender-table-status tender-table-error">{error}</div>}

      {!loading && !error && (
        <div className="tender-table-scroll">
          <table style={{ width: totalWidth }}>
            <colgroup>
              {COLUMNS.map((col) => (
                <col key={col.key as string} style={{ width: widths[col.key as string] }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key as string}>
                    <div className="tender-table-th-content">{col.title}</div>
                    <div
                      className="tender-table-resizer"
                      onMouseDown={handleResizeStart(col.key as string)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.CommercialOfferId}
                  className={row.CommercialOfferId === selectedId ? 'row-selected' : ''}
                  onClick={() => onRowClick(row)}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key as string}
                      className={[`col-${col.key}`, col.key === 'Decision' ? decisionClass(row.Decision) : ''].join(' ').trim()}
                    >
                      {formatCell(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="tender-table-empty">Нет данных для отображения</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenderTable;

