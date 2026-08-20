interface BlogSlugPageProps {
  params: {
    slug: string;
  };
}

const BlogSlugPage = ({ params }: BlogSlugPageProps) => {
  const { slug } = params;
  return <div>{slug}</div>;
};

export default BlogSlugPage;
