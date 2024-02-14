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
async function callFetch(url: string, options: FetchOptions = {method: "GET"}) {
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
  const responseData = isJSON ? await response.json() : await response.text();

  return {
    data: responseData?.error ? null : responseData,
    error: responseData?.error,
    success: response.ok,
  };
}

const api = {
  async get(url: string) {
    return callFetch(url);
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