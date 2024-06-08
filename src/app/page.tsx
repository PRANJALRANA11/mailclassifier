"use client"
import React, { use } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Home: React.FC = () => {
  const { data: session } = useSession();
  const[openaiKeys, setOpenaiKeys] = React.useState('' as string);
  const router = useRouter();
  if(session){
    router.push('/emails');
  }
  React.useEffect(() => {
    localStorage.setItem('openaiKeys', openaiKeys);
  }, [openaiKeys]);
  return (
    <Card className="mx-auto my-40 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your openai keys to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Keys</Label>
            <Input
              id="keys"
              type="password"
              placeholder="sk-....."
              onChange={(e) => setOpenaiKeys(e.target.value)}
              value={openaiKeys}
              required
            />
          </div>
          <Button variant="outline" className="w-full"  onClick={() => signIn('google')}>
            Login with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};





export default Home;
