import './Login.css';
import Loader from './Loader';
import { getUserFromDb } from './dbConnection'
import { FC, useCallback, useMemo, useState } from 'react';


export const Login: FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitForm = useCallback(async () => {
    try {
      setIsLoading(true);
      await getUserFromDb(userName, password);
    } catch (error) {
      alert('Login was not successful' + error);
    } finally {
      setIsLoading(false);
    }
  }, [password, userName]);

  const setUserPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.trim())
  }, [setPassword]);

  const setUserNameText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value.trim());
  }, [setUserName]);

  const isValid = useMemo(() => {
    return password.length > 0 && userName.length > 0;
  }, [password.length, userName.length])

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      submitForm();
    }
  }, [isValid, submitForm])

  return (
    <div className="App" onKeyDown={onKeyDown}>
      <div className='SignInModal'>
        <span style={{ marginTop: '20px' }}>Sign in to your list</span>
        {isLoading ? <Loader text='Signin you in...' /> :
          <><div className='inputSection'>
            <input type='text' className='input' placeholder='Enter user name' onChange={setUserNameText} value={userName}></input>
            <input type='password' className='input' placeholder='Enter password' onChange={setUserPassword} value={password}></input>
          </div><button className='button' disabled={!isValid} onClick={submitForm}>Submit</button>
          </>}
      </div>
    </div>
  );
}

export default Login;
