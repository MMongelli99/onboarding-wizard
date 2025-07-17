export type TableName = string;
export type ColumnName = string;

export type Row = Record<ColumnName, unknown>;

export type Table = {
  columns: ColumnName[];
  rows: Row[];
};

export type Database = Record<TableName, Table>;
