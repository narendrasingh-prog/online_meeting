export type ApiError = { 
    message:string;
    status?:number;
    code?:string;
    errorName?:string
    errorObj?:unknown
}

export type ApiResponse<T> = {success:true ; data:T ; message:string} | {success:false ;error :ApiError}