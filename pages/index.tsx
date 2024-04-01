import React from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Welcome to My Website</h1>
      <button onClick={() => router.push('/auth/login')}>Login</button>
      <button onClick={() => router.push('/auth/register')}>Register</button>
    </div>
  );
};

export default IndexPage;




