'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, QrCode } from "lucide-react";
import Image from 'next/image';
import { toast } from "sonner";

export function OtherServices() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState({ shorten: false, qr: false });

  const shortenUrl = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, shorten: true }));
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to shorten URL');
      
      const shortened = await response.text();
      setShortUrl(shortened);
      toast.success('URL shortened successfully!');
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error('Failed to shorten URL');
    } finally {
      setLoading(prev => ({ ...prev, shorten: false }));
    }
  };

  const generateQR = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, qr: true }));
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      setQrCode(qrUrl);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(prev => ({ ...prev, qr: false }));
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('QR code downloaded!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* URL Shortener Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            URL Shortener
          </CardTitle>
          <CardDescription>
            Shorten your long URLs instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              onClick={shortenUrl}
              disabled={loading.shorten}
            >
              {loading.shorten ? 'Shortening...' : 'Shorten'}
            </Button>
          </div>
          {shortUrl && (
            <div className="flex gap-2 items-center">
              <Input value={shortUrl} readOnly />
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(shortUrl)}
              >
                Copy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Generator Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Generator
          </CardTitle>
          <CardDescription>
            Convert your URL to a QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              onClick={generateQR}
              disabled={loading.qr}
            >
              {loading.qr ? 'Generating...' : 'Generate'}
            </Button>
          </div>
          {qrCode && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48">
                <Image
                  src={qrCode}
                  alt="Generated QR Code"
                  fill
                  className="object-contain"
                />
              </div>
              <Button onClick={downloadQR}>
                Download QR
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
