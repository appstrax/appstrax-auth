
export enum Operator {
  /** Equal To Operator */
  EQUAL = 'EQUAL',
  /** Not Equal To Operator */
  NOT_EQUAL = 'NOT_EQUAL',
  /** And Operator */
  AND = 'AND',
  /** Or Operator */
  OR = 'OR',
  /** Greater Than Operator */
  GT = 'GT',
  /** Greater Than or Equal To Operator */
  GTE = 'GTE',
  /** Less Than Operator */
  LT = 'LT',
  /** Less Than or Equal To Operator */
  LTE = 'LTE',
  /** Like Operator */
  LIKE = 'LIKE',
  /** Not Like Operator */
  NOT_LIKE = 'NOT_LIKE',
  /** In Operator */
  IN = 'IN',
}

export enum OrderDirection {
  /** Ascending Order Direction */
  ASC = 'ASC',
  /** Descending Order Direction */
  DESC = 'DESC',
}

export interface Where {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string | Operator]: object | Operator | [] | number | string | boolean;
}

export interface Order {
  [key: string]: OrderDirection;
}

export interface FetchQuery {
  where?: Where;
  order?: Order;
  offset?: number;
  limit?: number;
}
