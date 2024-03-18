const API_URL = process.env.NODE_ENV === 'production' ? '/api' : `http://localhost:8080/api`;

const NETWORK_ERROR = {
  data: null,
  error: {
    code: "ERR_CONNECTION_REFUSED",
    message: "Server connection failed.",
  },
  success: false,
};

interface FetchOptions {
  method: string
  body?: object,
  headers?: object,
};
interface ErrorObject {
  code: string,
  message: string,
}
async function callFetch<ReturnType = any>(url: string, options: FetchOptions = {method: "GET"}) {
  const { method, body = {}, headers } = options;

  let response;
  try {
    response = await fetch(`${API_URL}${url}`, {
      method,
      credentials: "include",
      body: method === "GET" ? undefined : JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  } catch(err) {
    return NETWORK_ERROR;
  }

  const contentType = response.headers.get('Content-Type') || '';
  const isJSON = contentType.includes('application/json');
  const responseData: ReturnType & {error?: ErrorObject} = isJSON ? await response.json() : await response.text();

  const returnData: {
    data: ReturnType,
    error: null,
    success: true,
  }|{
    data: null,
    error: ErrorObject,
    success: false,
  } = responseData?.error ? {
    data: null,
    error: responseData.error,
    success: false,
  } : {
    data: responseData,
    error: null,
    success: true,
  };

  return returnData;
}

const api = {
  async get<ReturnType = any>(url: string) {
    return callFetch<ReturnType>(url);
  },
  async post(url: string, data: any) {
    return callFetch(url, { method: "POST", body: data });
  },
  async patch(url: string, data: any) {
    return callFetch(url, { method: "PATCH", body: data });
  },
  async delete(url: string) {
    return callFetch(url, { method: "DELETE" });
  },
};

export default api;