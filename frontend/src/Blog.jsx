import { useParams } from "react-router-dom";

const Blog = () => {
  const { slug } = useParams();
  return <>Blog page according to Slug: {slug}.</>;
};

export default Blog;
