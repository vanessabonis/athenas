import { Sort } from "./Pageable";

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: Sort | null;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}
  