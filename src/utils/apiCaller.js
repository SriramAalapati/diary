const BASE_URL = "http://localhost:3000";

async function apiCaller(
  path,
  body = null,
  method = "GET",
  customHeaders = {}
) {
  const isFormData = body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "content-type": "application/json" }),
    ...customHeaders,
  };
  const options = {
    method,
    headers,
    ...(body && { body: isFormData ? body : JSON.stringify(body) }),
    credentials: "include",
  };

  try {

    const response = await fetch(`${BASE_URL}${path}`, options);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "API Error");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default apiCaller;
