import { render, screen } from '@testing-library/react'
import { Header } from './index';
/**
 * utilizando a segunda forma de verificar se um component está em tela.
 * utilizando o screen, sem precisar pegar o retorno da função render 
 */
jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
});

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    }
  }
});

describe('Header Component', () => {
  it('render correctly', () => {
    render(
      <Header />
    )
  
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  })
})
