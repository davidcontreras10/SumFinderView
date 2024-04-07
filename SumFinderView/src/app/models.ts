export interface SumResults {
    numbers: Array<Array<number>>;
    attempts: number;
}

export enum SumEndingType {
    Unknown = 0,
    End = 1,
    Error = 2,
    Cancelled = 3
}

export interface FinalizedSum {
    sumResults: SumResults;
    sumEndingType: SumEndingType;
}