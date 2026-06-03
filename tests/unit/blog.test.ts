import { getAllPosts } from '@/lib/blog';
import { client } from '@/lib/sanity';

jest.mock('@/lib/sanity', () => ({
  client: {
    fetch: jest.fn(),
    config: jest.fn(() => ({
      projectId: 'test-project',
      dataset: 'production',
      useCdn: false
    })),
  },
}));

jest.mock('@/lib/sanity.server', () => ({
  serverClient: {
    fetch: jest.fn(),
    config: jest.fn(() => ({
      projectId: 'test-project',
      dataset: 'production',
      useCdn: false
    })),
  },
}));

describe('lib/blog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  });

  it('fetches all posts from sanity', async () => {
    const mockPosts = [
      { id: '1', title: 'Test Post', slug: 'test-post', is_published: true },
    ];
    (client.fetch as jest.Mock).mockResolvedValue(mockPosts);

    const posts = await getAllPosts();

    expect(client.fetch).toHaveBeenCalled();
    expect(posts).toEqual(mockPosts);
  });

  it('returns posts even if project ID environment variable is missing (uses fallback)', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const mockPosts = [{ id: '1', title: 'Test Post' }];
    (client.fetch as jest.Mock).mockResolvedValue(mockPosts);

    const posts = await getAllPosts();
    expect(posts).toEqual(mockPosts);
    expect(client.fetch).toHaveBeenCalled();
  });
});
