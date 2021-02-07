import ApiResponse from "./api_response";
import ResponseCode from "./codes";

class AllOK extends ApiResponse {
    constructor(message?: string) {
        super(ResponseCode.OK, message || "All Ok");
    }
}

export default AllOK;
