
export const enum RequestMethod {
    Get, Post, Put, Delete
}

export function requestMethodToString(requestMethod: RequestMethod) {

    switch (requestMethod) {
        case RequestMethod.Get: return 'GET';
        case RequestMethod.Post: return 'POST';
        case RequestMethod.Put: return 'PUT';
        case RequestMethod.Delete: return 'DELETE';
    }
}