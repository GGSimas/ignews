import React, { useEffect } from "react";
import { GetStaticProps } from "next"
import Link from 'next/link';
import { useRouter } from "next/router";
import { useSession } from "next-auth/client"
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import { formatToLongDate } from "../../../services/utils";
import styles from '../post.module.scss';

interface Post {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const route = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      route.push(`/posts/${post.slug}`)
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post?.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post?.title}</h1>
          <time>{post?.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading??
            <Link href="/">
              <a>Subscribe Now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;


  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.publication_title),
    content: RichText.asHtml(response.data.publication_content.splice(3,3)),
    updatedAt: formatToLongDate(response.last_publication_date),
  }
  return {
    props: {
      post,
    },
    revalidate: 60 * 30 //30 minutos
  }

}