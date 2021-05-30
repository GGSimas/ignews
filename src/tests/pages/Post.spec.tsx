import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getSession } from 'next-auth/client';


jest.mock('../../services/prismic');
jest.mock('next-auth/client');

const post =  { 
  slug: 'fake-post-slug',
  title: 'fake post title', 
  content: '<p>fake excerpt</p>',
  updatedAt: '26 de maio' 
};

describe('Post', () => {
  it('render correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('fake post title')).toBeInTheDocument();
    expect(screen.getByText('fake excerpt')).toBeInTheDocument();
  });
  
  it('redirects user if no subscription found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any)
    const response = await getServerSideProps({ params: { slug: 'my-new-post'}} as any);

    expect(response).toEqual(
      expect.objectContaining({
          redirect: expect.objectContaining({
            destination: '/',
          })
      })
    )
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-suscription',
    } as any)

    const getPrismicClientMocked = mocked(getPrismicClient)
    
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          publication_title: [
            {type: 'heading', text: 'My new Post'}
          ],
          publication_content: [
            {type: 'paragraph', text: 'My new Post Content'}
          ],
        },
        last_publication_date: '05-26-2021',
      })
    } as any);

    const response = await getServerSideProps({ params: { slug: 'my-new-post'}} as any);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
          slug: 'my-new-post',
          title: 'My new Post',
          content: '<p>My new Post Content</p>',
          updatedAt: '26 de maio de 2021',
          }
        }
      })
    )
  })
})