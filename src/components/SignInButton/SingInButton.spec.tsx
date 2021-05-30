import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client'
import { SignInButton } from './index';
/**
 * utilizando a segunda forma de verificar se um component está em tela.
 * utilizando o screen, sem precisar pegar o retorno da função render 
 */

jest.mock('next-auth/client')

describe('SiginButton Component', () => {
  it('render correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<SignInButton />)
  
    expect(screen.getByText('Sign In with Github')).toBeInTheDocument();
  })

  it('render correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      expires: 'fake-expires'
    }, false]);
    render(<SignInButton />)
  
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  })
})
