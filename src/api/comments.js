export const fetchComments = async (postId) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  if (!res.ok) throw new Error('Ошибка загрузки комментариев');
  return res.json();
};