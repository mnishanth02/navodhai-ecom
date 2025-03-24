export type ActionResponse<T> =
  | {
      success: true;
      data?: T;
      message?: string;
    }
  | {
      success: false;
      error: ActionError;
    };

interface ActionError {
  serverError?: ServerError;
  validationErrors?: ValidationError[];
}

interface ServerError {
  message: string;
  code: number;
}

interface ValidationError {
  field: string;
  message: string;
}

//  ******* API Response *******
export type ApiResponse<T> =
  | {
      success: true;
      data?: T;
      message?: string;
    }
  | {
      success: false;
      error: ApiError;
    };

interface ApiError {
  code: number;
  message: string;
}
