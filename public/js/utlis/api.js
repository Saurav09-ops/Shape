export async function fetchReactionData(reaction, postId, opt) {
  try {
    let response = await fetch(`/${reaction}/${postId}`, opt);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    let result = await response.json();
    return result;
  } catch (err) {
    console.log("DataResponse err:", err);
    return { error: true, message: err.message || "Unknown error" };
  }
}
