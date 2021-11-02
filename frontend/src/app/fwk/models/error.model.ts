export class RestError2 extends Error {

    httpStatusCode: string;
    code: string;
    errorCode: string;
    cause: string;
    validationErrors: ValidationError[];
    exception: string;
    //properties: Map<String, Object>;
}

export class ValidationError {
    message: string;
}

export class RestError extends Error {
    Messages: string[] = [];
    Status: string;
}
