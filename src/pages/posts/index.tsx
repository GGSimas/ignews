import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

import style from './styles.module.scss';
import { formatToLongDate } from '../../services/utils';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}
export default function Posts({ posts }: PostsProps) {
  return (
    <>
    <Head>
      <title>ig.news | Posts</title>
    </Head>

    <main className={style.postContainer}>
      <div className={style.postList}>
        {posts?.map(post => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <a>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>
                {post.excerpt}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </main>
  </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'publication'),
  ], {
    fetch: ['publication.publication_title', 'publication.publication_content'],
    pageSize: 20,
  });
  
  // console.log(JSON.stringify(response, null, 2));
  const posts = response.results.map(post => {
    const excerpt = post.data.publication_content.find(
        content => content.type === 'paragraph'
      ).text ?? '';

    return {
      slug: post.uid,
      title: RichText.asText(post.data.publication_title),
      updatedAt: formatToLongDate(post.last_publication_date),
      excerpt,
    }
  })
  return {
    props: {
      posts,
    },
    revalidate: 60 * 30 // 30 minutos
  }
}