export async function getFollowingUsers() {
  try {
    // NOTE: Should be using client service.
    const response = await fetch("/social/profiles/following", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // adjust if you use another method. Use getAccessToken fn from check auth service. That's what its there for.
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch following users");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
