import ResponseCode from "./codes";

class ApiResponse {
    constructor(
        public code: ResponseCode,
        public message: string,
    ) {}
}

export default ApiResponse;
