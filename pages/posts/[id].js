import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostsIds, getPostData } from "../../lib/posts";

export default function Post({ postData }) {
  console.log({ postData });
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostsIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
