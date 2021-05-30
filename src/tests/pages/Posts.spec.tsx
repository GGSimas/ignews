import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts';


jest.mock('../../services/prismic');

const posts = [
  { slug: 'fake-post-slug', title: 'fake post title', excerpt: 'fake excerpt', updatedAt: '26 de maio' },
]
describe('Posts', () => {
  it('render correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('fake post title')).toBeInTheDocument();
  });
  
  it('loading initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-post-slug',
            data: {
              publication_title: [
                {type: 'heading', text: 'My new Post' }
              ],
              publication_content: [
                { type: 'paragraph', text: 'My new Post Content' }
              ]
            },
            last_publication_date: '05-26-2021',
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'fake-post-slug',
            title: 'My new Post',
            excerpt: 'My new Post Content',
            updatedAt: '26 de maio de 2021',
          }]
        }
      })
    )
  })
})