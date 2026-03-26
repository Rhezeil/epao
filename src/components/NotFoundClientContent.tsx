
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from 'lucide-react';

export function NotFoundClientContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get('code');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-[3rem] overflow-hidden text-center">
        <CardHeader className="bg-primary p-10 text-white flex flex-col items-center gap-4">
          <div className="p-4 bg-white/20 rounded-full">
            <Search className="h-12 w-12" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter">404</CardTitle>
          <p className="text-sm font-black uppercase tracking-widest opacity-60">Record Not Found</p>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-primary">Page Missing</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              The workstation or record you are looking for has been moved or does not exist in the PAO registry.
            </p>
            {errorCode && (
              <Badge variant="outline" className="mt-4 border-primary/10 text-primary font-black uppercase text-[10px]">
                Diagnostics: {errorCode}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.push('/')} 
              className="h-14 rounded-2xl bg-primary text-white font-black shadow-lg"
            >
              <Home className="mr-2 h-5 w-5" /> Return to Command Center
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.back()} 
              className="h-14 rounded-2xl border-primary/10 font-bold"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
