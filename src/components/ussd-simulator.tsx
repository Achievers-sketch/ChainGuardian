'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/mock-data';
import { Send, Delete, Star, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

type Screen = 'HOME' | 'MENU' | 'PROMPT_CODE' | 'VERIFYING' | 'RESULT';

const UssdSimulator = () => {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [input, setInput] = useState('');
  const [productCode, setProductCode] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    setInput((prev) => prev + key);
  };

  const handleSend = () => {
    if (screen === 'HOME' && input === '*123#') {
      setScreen('MENU');
      setInput('');
    } else if (screen === 'MENU' && input === '1') {
      setScreen('PROMPT_CODE');
      setInput('');
    } else if (screen === 'PROMPT_CODE') {
      setProductCode(input);
      setScreen('VERIFYING');
      setInput('');
    }
  };
  
  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  }

  useEffect(() => {
    if (screen === 'VERIFYING') {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.id === productCode);
        if (product) {
          setResult(`Product: ${product.name} is AUTHENTIC. Batch: ${product.batchNumber}. Expires: ${new Date(product.expiryDate).toLocaleDateString()}`);
        } else {
          setResult('Product not found. LIKELY COUNTERFEIT. Do not use. Report this product.');
        }
        setScreen('RESULT');
      }, 1500);
    }
  }, [screen, productCode]);
  
  const getScreenContent = () => {
    switch (screen) {
      case 'HOME':
        return `Dial USSD code to start.`;
      case 'MENU':
        return `Welcome to ChainGuardian!\n1. Verify Product\n2. Help\n3. Exit`;
      case 'PROMPT_CODE':
        return 'Please enter the 12-digit product code found on the packaging:';
      case 'VERIFYING':
        return 'Verifying product... Please wait.';
      case 'RESULT':
        return result;
      default:
        return '';
    }
  };

  const keypadLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <div className="bg-gray-800 border-8 border-gray-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden font-mono">
      <div className="bg-blue-900/50 text-cyan-300 p-4 h-64 flex flex-col justify-center">
        <p className="whitespace-pre-wrap text-center text-sm">{getScreenContent()}</p>
        {(screen === 'HOME' || screen === 'MENU' || screen === 'PROMPT_CODE') && (
            <div className="mt-4 h-6 text-center text-white font-bold tracking-widest border-b-2 border-cyan-300 animate-pulse">{input}</div>
        )}
      </div>
      <div className="bg-gray-700 p-4">
        <div className="grid grid-cols-3 gap-2">
          {keypadLayout.flat().map((key) => (
            <Button
              key={key}
              variant="secondary"
              className="h-14 text-2xl bg-gray-600 hover:bg-gray-500 text-white rounded-lg aspect-square"
              onClick={() => handleKeyPress(key)}
            >
              {key === '*' && <Star className="h-6 w-6" />}
              {key === '#' && <Hash className="h-6 w-6" />}
              {key !== '*' && key !== '#' && key}
            </Button>
          ))}
          <Button variant="ghost" className="h-14" onClick={handleBackspace}>
            <Delete className="h-6 w-6 text-yellow-400"/>
          </Button>
          <div/>
          <Button variant="ghost" className="h-14" onClick={handleSend}>
             <Send className="h-6 w-6 text-green-400"/>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UssdSimulator;
