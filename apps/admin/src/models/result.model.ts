export interface Result<T>{
    data?:T;
    errorMessage?:string[];
    isSuccessfull:boolean;
    statusCode:number;
}