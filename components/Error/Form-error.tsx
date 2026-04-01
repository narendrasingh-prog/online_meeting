import React from "react";

type ErrorFieldProps={
    error?:{message:string} | undefined
}

const FormError = ({error}:ErrorFieldProps) => {
if(!error?.message) return null;
    
  return (
    <div className="text-red-600 font-serif text-sm">
      
        <p>{error?.message}</p>
     
    </div>
  );
};

export default FormError;
