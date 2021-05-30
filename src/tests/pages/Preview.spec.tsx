import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { useSession } from 'next-auth/client';


jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

const post =  { 
  slug: 'fake-post-slug',
  title: 'fake post title', 
  content: '<p>fake excerpt</p>',
  updatedAt: '26 de maio' 
};

describe('Post Preview Page', () => {
  it('render correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]); 
    render(<PostPreview post={post} />);

    expect(screen.getByText('fake post title')).toBeInTheDocument();
    expect(screen.getByText('fake excerpt')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading??')).toBeInTheDocument();
  });
  
  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([{
        activeSubscription: 'fake-active-subscription',
      }, false] as any); 


      useRouterMocked.mockReturnValueOnce({
        push: pushMock
      } as any)
      
      render(<PostPreview post={post} />);

      expect(pushMock).toHaveBeenCalledWith('/posts/fake-post-slug')
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          publication_title: [
            {type: 'heading', text: 'My new Post'}
          ],
          publication_content: [
            {type: 'paragraph', text: 'Post Content'}
          ],
        },
        last_publication_date: '05-26-2021',
      })
    } as any);

    
    const response = await getStaticProps({ params: { slug: 'my-new-post'}});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
          slug: 'my-new-post',
          title: 'My new Post',
          content: '',
          updatedAt: '26 de maio de 2021',
          }
        }
      })
    )
  })
})