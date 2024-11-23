'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Link2, Copy, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";

export function OtherServices() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [copying, setCopying] = useState(false);

  const shortenUrl = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to shorten URL');
      
      const shortened = await response.text();
      setShortUrl(shortened);
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten URL. Please try again.');
      console.error('Error shortening URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    } finally {
      setCopying(false);
    }
  };

  const openQrCode = () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    // Using QR Code Generator API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    window.open(qrUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Services</CardTitle>
        <CardDescription>
          Additional tools to help manage and share your links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Enter URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shortenUrl}
              disabled={loading || !url}
              className="gap-2"
            >
              <Link2 className="h-4 w-4" />
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={openQrCode}
              disabled={!url}
              className="gap-2"
            >
              <QrCode className="h-4 w-4" />
              Generate QR Code
            </Button>
          </div>

          {shortUrl && (
            <div className="space-y-2">
              <Label>Shortened URL</Label>
              <div className="flex items-center gap-2">
                <Input value={shortUrl} readOnly />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(shortUrl)}
                  disabled={copying}
                >
                  {copying ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(shortUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
