export async function postApi(url, body, token, ct) {
  try {
    if (token) {
      customAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const response = await customAxios.post(url, body, {
      headers: {
        "Content-Type": ct || "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
