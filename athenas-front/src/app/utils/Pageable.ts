export interface Pageable {
    pageNumber: number;        
    pageSize: number;          
    sort: Sort | null;         
  }
  
  export interface Sort {
    sorted: boolean;            
    unsorted: boolean;          
    empty: boolean;             
    direction: 'ASC' | 'DESC';  
    property: string | null;    
  }
  