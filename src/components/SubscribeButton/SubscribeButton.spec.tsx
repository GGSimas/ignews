import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router';
import { SubscribeButton } from './index';
/**
 * utilizando a segunda forma de verificar se um component está em tela.
 * utilizando o screen, sem precisar pegar o retorno da função render 
 */

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton Component', () => {
  it('render correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    
    render(<SubscribeButton />)
  
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });

  it('redirect user to singin when not authenticated', () => {
    const sigInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession); 
    useSessionMocked.mockReturnValueOnce([null, false]);
    
    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe');

    fireEvent.click(subscribeButton);

    expect(sigInMocked).toHaveBeenCalled();
  });

  it('redirects to posts when user already has a subscription', () => {
    const userRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    const pushMock = jest.fn();

    userRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        activeSubscription: 'fake-sub',
        expires: 'fake-expires',
      },
      false
    ])

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalled();
  })
})
